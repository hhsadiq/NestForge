import { APP_URL } from '@test/utils/constants';
import { fakeGenerator } from '@test/utils/faker';
import request from 'supertest';

import {
  ALREADY_FOLLOWING_ERROR,
  NOT_FOLLOWING_ERROR,
} from '../../src/common/error-messages';
import {
  USER_FOLLOW_SUCCESS,
  USER_UNFOLLOW_SUCCESS,
} from '../../src/common/response-messages';

describe('Follow/Unfollow Module', () => {
  let authToken;
  let usernameForTesting;
  const app = APP_URL;

  beforeAll(async () => {
    // Create and authenticate the primary user
    const userEmail = fakeGenerator.generateEmail();
    const userPassword = fakeGenerator.generatePassword();
    const firstName = fakeGenerator.generateFirstName();
    const lastName = fakeGenerator.generateLastName();
    const username = `Primary${firstName}`;

    await request(app)
      .post('/api/v1/auth/email/register')
      .send({
        email: userEmail,
        password: userPassword,
        firstName,
        lastName,
        username,
      })
      .expect(204);

    // Create and authenticate another user to follow
    const anotherUserEmail = fakeGenerator.generateEmail();
    const anotherUserPassword = fakeGenerator.generatePassword();
    const anotherFirstName = fakeGenerator.generateFirstName();
    const anotherLastName = fakeGenerator.generateLastName();
    const anotherUsername = `Another${anotherFirstName}`;

    await request(app)
      .post('/api/v1/auth/email/register')
      .send({
        email: anotherUserEmail,
        password: anotherUserPassword,
        firstName: anotherFirstName,
        lastName: anotherLastName,
        username: anotherUsername,
      })
      .expect(204);

    usernameForTesting = anotherUsername;

    authToken = await request(app)
      .post('/api/v1/auth/email/login')
      .send({ email: userEmail, password: userPassword })
      .then(({ body }) => body.token);
  });

  it('should successfully follow another user: /api/v1/users/:username/follow (POST)', () => {
    return request(app)
      .post(`/api/v1/users/${usernameForTesting}/follow`)
      .auth(authToken, { type: 'bearer' })
      .expect(201)
      .expect(({ body }) => {
        expect(body.message).toBe(USER_FOLLOW_SUCCESS);
      });
  });

  it('should fail to follow the same user twice: /api/v1/users/:username/follow (POST)', () => {
    return request(app)
      .post(`/api/v1/users/${usernameForTesting}/follow`)
      .auth(authToken, { type: 'bearer' })
      .expect(400)
      .expect(({ body }) => {
        expect(body.message).toBe(ALREADY_FOLLOWING_ERROR);
      });
  });

  it('should successfully unfollow a user: /api/v1/users/:username/follow (DELETE)', () => {
    return request(app)
      .delete(`/api/v1/users/${usernameForTesting}/follow`)
      .auth(authToken, { type: 'bearer' })
      .expect(200)
      .expect(({ body }) => {
        expect(body.message).toBe(USER_UNFOLLOW_SUCCESS);
      });
  });

  it('should fail to unfollow a user not followed: /api/v1/users/:username/follow (DELETE)', () => {
    return request(app)
      .delete(`/api/v1/users/${usernameForTesting}/follow`)
      .auth(authToken, { type: 'bearer' })
      .expect(400)
      .expect(({ body }) => {
        expect(body.message).toBe(NOT_FOLLOWING_ERROR);
      });
  });
});
