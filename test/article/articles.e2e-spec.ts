import { APP_URL } from '@test/utils/constants';
import { fakeGenerator } from '@test/utils/faker';
import request from 'supertest';

describe('ArticlesController (e2e)', () => {
  const app = APP_URL;
  const newUserFirstName = fakeGenerator.generateFirstName();
  const newUserLastName = fakeGenerator.generateLastName();
  const newUserEmail = fakeGenerator.generateEmail();
  const newUserPassword = fakeGenerator.generatePassword();
  const username = `user${newUserFirstName}`;
  let articleIdOfCreatedArticle;
  let articleSlugOfCreatedArticle;
  let commentIdOnCreatedArticle;
  let apiToken: string;

  beforeAll(async () => {
    await request(app).post('/api/v1/auth/email/register').send({
      email: newUserEmail,
      password: newUserPassword,
      username,
      firstName: newUserFirstName,
      lastName: newUserLastName,
    });
    apiToken = (
      await request(app).post('/api/v1/auth/email/login').send({
        email: newUserEmail,
        password: newUserPassword,
      })
    ).body.token;
  });

  afterAll(async () => {});

  it('should create a new article with random data', async () => {
    const newArticle = {
      body: fakeGenerator.generateParagraph(), // Required
      description: fakeGenerator.generateSentence(), // Required
      autoGenerateTitle: false, // Derived logic; include if needed
      title: fakeGenerator.generateWords(3), // Required
      tagList: fakeGenerator.generateTagList(), // Optional
    };

    const response = await request(app)
      .post('/api/v1/articles')
      .send(newArticle)
      .set('Authorization', 'Bearer ' + apiToken)
      .expect(201);

    articleIdOfCreatedArticle = response.body.id;
    articleSlugOfCreatedArticle = response.body.slug;
    // Validate required properties

    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('slug');
    expect(response.body.body).toBe(newArticle.body);
    expect(response.body.description).toBe(newArticle.description);
    expect(response.body.title).toBe(newArticle.title);

    // Validate optional properties
    expect(response.body.tagList).toEqual(newArticle.tagList);

    // Validate auto-generated fields
    expect(response.body).toHaveProperty('createdAt');
    expect(response.body).toHaveProperty('updatedAt');

    // Validate author information
    expect(response.body).toHaveProperty('author');
    expect(response.body.author).toHaveProperty('id');
    expect(response.body.author).toHaveProperty('firstName');
    expect(response.body.author).toHaveProperty('lastName');
  });

  it('should retrieve a list of articles', async () => {
    const response = await request(app)
      .get('/api/v1/articles')
      .set('Authorization', 'Bearer ' + apiToken)
      .expect(200);

    // Validate the response structure
    expect(response.body).toHaveProperty('data');
    expect(Array.isArray(response.body.data)).toBe(true);
    expect(response.body).toHaveProperty('hasNextPage');
    expect(typeof response.body.hasNextPage).toBe('boolean');

    // Validate the first article in the list (if exists)
    const firstArticle = response.body.data[0];
    if (firstArticle) {
      expect(firstArticle).toHaveProperty('id');
      expect(typeof firstArticle.id).toBe('string');

      expect(firstArticle).toHaveProperty('slug');
      expect(typeof firstArticle.slug).toBe('string');

      expect(firstArticle).toHaveProperty('title');
      expect(typeof firstArticle.title).toBe('string');

      expect(firstArticle).toHaveProperty('description');
      expect(typeof firstArticle.description).toBe('string');

      expect(firstArticle).toHaveProperty('body');
      expect(typeof firstArticle.body).toBe('string');

      expect(firstArticle).toHaveProperty('tagList');
      expect(Array.isArray(firstArticle.tagList)).toBe(true);

      // Validate author information
      expect(firstArticle).toHaveProperty('author');
      expect(firstArticle.author).toHaveProperty('id');
      expect(firstArticle.author).toHaveProperty('username');
      expect(firstArticle.author).toHaveProperty('firstName');
      expect(firstArticle.author).toHaveProperty('lastName');
      expect(firstArticle.author).toHaveProperty('role');
      expect(firstArticle.author).toHaveProperty('status');
      expect(firstArticle.author.role).toHaveProperty('name');
      expect(firstArticle.author.status).toHaveProperty('name');

      // Validate timestamps
      expect(firstArticle).toHaveProperty('createdAt');
      expect(firstArticle).toHaveProperty('updatedAt');
      expect(new Date(firstArticle.createdAt).toString()).not.toBe(
        'Invalid Date',
      );
      expect(new Date(firstArticle.updatedAt).toString()).not.toBe(
        'Invalid Date',
      );
    }
  });

  it('should return paginated articles', async () => {
    const response = await request(app)
      .get('/api/v1/articles/standard')
      .query({ page: 1, limit: 5 })
      .set('Authorization', 'Bearer ' + apiToken)
      .expect(200);

    // Check the response structure
    expect(response.body).toHaveProperty('data');
    expect(response.body).toHaveProperty('hasNextPage');
    expect(response.body).toHaveProperty('totalRecords');
    expect(response.body).toHaveProperty('pageNumber');
    expect(response.body).toHaveProperty('pageLimit');
    expect(response.body).toHaveProperty('from');
    expect(response.body).toHaveProperty('to');

    // Check pagination correctness
    expect(response.body.data.length).toBeLessThanOrEqual(5);
    expect(response.body.pageNumber).toBe(1);
    expect(response.body.pageLimit).toBe(5);
    expect(response.body.from).toBe(1);
  });

  it('should retrieve an article by its ID', async () => {
    const articleId = articleIdOfCreatedArticle;

    const response = await request(app)
      .get(`/api/v1/articles/${articleId}`)
      .set('Authorization', 'Bearer ' + apiToken)
      .expect(200);

    // Validate the response structure
    expect(response.body).toHaveProperty('id');
    expect(response.body.id).toBe(articleId);

    expect(response.body).toHaveProperty('slug');
    expect(response.body).toHaveProperty('title');
    expect(response.body).toHaveProperty('description');
    expect(response.body).toHaveProperty('body');

    // Validate author information
    expect(response.body).toHaveProperty('author');
    expect(response.body.author).toHaveProperty('id');
    expect(response.body.author).toHaveProperty('firstName');
    expect(response.body.author).toHaveProperty('lastName');

    // Validate tagList
    expect(response.body).toHaveProperty('tagList');
    expect(Array.isArray(response.body.tagList)).toBe(true);

    // Validate timestamps
    expect(response.body).toHaveProperty('createdAt');
    expect(response.body).toHaveProperty('updatedAt');
    expect(new Date(response.body.createdAt).toString()).not.toBe(
      'Invalid Date',
    );
    expect(new Date(response.body.updatedAt).toString()).not.toBe(
      'Invalid Date',
    );
  });

  it('should update an article title by its ID', async () => {
    const articleId = articleIdOfCreatedArticle;
    const updatedArticleData = {
      description: 'new and updated description', // description to be updated
    };

    const response = await request(app)
      .patch(`/api/v1/articles/${articleId}`)
      .send(updatedArticleData)
      .set('Authorization', 'Bearer ' + apiToken)
      .expect(200);

    // Validate the response structure
    expect(response.body).toHaveProperty('id');
    expect(response.body.id).toBe(articleId);

    expect(response.body).toHaveProperty('slug');
    expect(response.body).toHaveProperty('title');
    expect(response.body.description).toBe(updatedArticleData.description); // Check if the title is updated

    expect(response.body).toHaveProperty('description');
    expect(response.body).toHaveProperty('body');

    // Validate author information
    expect(response.body).toHaveProperty('author');
    expect(response.body.author).toHaveProperty('id');
    expect(response.body.author).toHaveProperty('firstName');
    expect(response.body.author).toHaveProperty('lastName');

    // Validate tagList
    expect(response.body).toHaveProperty('tagList');
    expect(Array.isArray(response.body.tagList)).toBe(true);

    // Validate timestamps (updatedAt should be new)
    expect(response.body).toHaveProperty('createdAt');
    expect(response.body).toHaveProperty('updatedAt');
    expect(new Date(response.body.updatedAt).toString()).not.toBe(
      'Invalid Date',
    );
  });

  it('should add a comment to an article by its slug', async () => {
    const articleSlug = articleSlugOfCreatedArticle;
    const newComment = {
      body: 'very good article', // Comment body
    };

    const response = await request(app)
      .post(`/api/v1/articles/${articleSlug}/comments`)
      .send(newComment)
      .set('Authorization', 'Bearer ' + apiToken)
      .expect(201);

    // Validate the response structure
    commentIdOnCreatedArticle = response.body.id;
    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('body');
    expect(response.body.body).toBe(newComment.body); // Check if the comment body is correct

    expect(response.body).toHaveProperty('createdAt');
    expect(response.body).toHaveProperty('updatedAt');

    // Validate author information
    expect(response.body).toHaveProperty('author');
    expect(response.body.author).toHaveProperty('id');
    expect(response.body.author).toHaveProperty('username');

    // Validate timestamps
    expect(new Date(response.body.createdAt).toString()).not.toBe(
      'Invalid Date',
    );
    expect(new Date(response.body.updatedAt).toString()).not.toBe(
      'Invalid Date',
    );
  });

  it('should retrieve comments for an article by its slug', async () => {
    const articleSlug = articleSlugOfCreatedArticle; // Replace with the actual slug from the created article

    const response = await request(app)
      .get(`/api/v1/articles/${articleSlug}/comments`)
      .set('Authorization', 'Bearer ' + apiToken)
      .expect(200);

    // Validate the response structure
    expect(response.body).toHaveProperty('data');
    expect(Array.isArray(response.body.data)).toBe(true);
    expect(response.body).toHaveProperty('hasNextPage');
    expect(typeof response.body.hasNextPage).toBe('boolean');

    // Validate the first comment in the list (if exists)
    const firstComment = response.body.data[0];
    if (firstComment) {
      expect(firstComment).toHaveProperty('id');
      expect(typeof firstComment.id).toBe('string');

      expect(firstComment).toHaveProperty('body');
      expect(typeof firstComment.body).toBe('string');
      expect(firstComment.body).toBe('very good article'); // Check the correct comment body

      expect(firstComment).toHaveProperty('author');
      expect(firstComment.author).toHaveProperty('id');
      expect(firstComment.author).toHaveProperty('username');

      expect(firstComment).toHaveProperty('createdAt');
      expect(firstComment).toHaveProperty('updatedAt');

      // Validate timestamps
      expect(new Date(firstComment.createdAt).toString()).not.toBe(
        'Invalid Date',
      );
      expect(new Date(firstComment.updatedAt).toString()).not.toBe(
        'Invalid Date',
      );
    }
  });

  it('should add an article to favorites', async () => {
    const articleSlug = articleSlugOfCreatedArticle;

    const response = await request(app)
      .post(`/api/v1/articles/${articleSlug}/favorite`)
      .set('Authorization', 'Bearer ' + apiToken)
      .expect(201);

    // Validate the response message
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toBe(
      'Article added to favorites successfully.',
    );
  });

  it("should retrieve a user's feed of articles", async () => {
    const response = await request(app)
      .get('/api/v1/articles/user/feed')
      .set('Authorization', 'Bearer ' + apiToken)
      .expect(200);

    // Validate the structure of the response
    expect(response.body).toHaveProperty('data');
    expect(Array.isArray(response.body.data)).toBe(true);
    expect(response.body).toHaveProperty('hasNextPage');
    expect(typeof response.body.hasNextPage).toBe('boolean');

    // Validate the first article in the user's feed (if exists)
    const firstArticle = response.body.data[0];
    if (firstArticle) {
      expect(firstArticle).toHaveProperty('id');
      expect(firstArticle).toHaveProperty('slug');
      expect(firstArticle).toHaveProperty('title');
      expect(firstArticle).toHaveProperty('description');
      expect(firstArticle).toHaveProperty('body');
      // Validate timestamps
      expect(firstArticle).toHaveProperty('createdAt');
      expect(firstArticle).toHaveProperty('updatedAt');
      expect(new Date(firstArticle.createdAt).toString()).not.toBe(
        'Invalid Date',
      );
      expect(new Date(firstArticle.updatedAt).toString()).not.toBe(
        'Invalid Date',
      );
    }
  });

  it('should remove an article from favorites', async () => {
    const response = await request(app)
      .delete(`/api/v1/articles/${articleSlugOfCreatedArticle}/favorite`) // Use the actual slug of the article
      .set('Authorization', 'Bearer ' + apiToken)
      .expect(200);

    // Validate response message
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toBe(
      'Article removed from favorites successfully.',
    );
  });

  it('should delete a comment from an article', async () => {
    const commentId = commentIdOnCreatedArticle;
    const articleSlug = articleSlugOfCreatedArticle;

    // Step 1: Delete the comment
    await request(app)
      .delete(`/api/v1/articles/${articleSlug}/comments/${commentId}`)
      .set('Authorization', 'Bearer ' + apiToken)
      .expect(200);
    // Step 2: Retrieve the list of comments for the article after deletion
    const getCommentsResponse = await request(app)
      .get(`/api/v1/articles/${articleSlug}/comments`)
      .set('Authorization', 'Bearer ' + apiToken)
      .expect(200);

    // Validate that the comment list is empty
    expect(getCommentsResponse.body).toHaveProperty('data');
    expect(Array.isArray(getCommentsResponse.body.data)).toBe(true);
    expect(getCommentsResponse.body.data.length).toBe(0); // Ensuring no comments remain

    // Optional: Verify that trying to get the deleted comment directly returns a 404
    await request(app)
      .get(`/api/v1/articles/${articleSlug}/comments/${commentId}`)
      .set('Authorization', 'Bearer ' + apiToken)
      .expect(404);
  });

  it('should delete an article by its ID', async () => {
    const articleId = articleIdOfCreatedArticle;

    // Step 1: Send DELETE request to delete the article by its ID
    await request(app)
      .delete(`/api/v1/articles/${articleId}`)
      .set('Authorization', 'Bearer ' + apiToken) // Ensure the token is set if authorization is required
      .expect(200);
  });
});
