import { Session } from '@src/sessions/domain/session';
import { User } from '@src/users/domain/user';

export type JwtPayloadType = Pick<User, 'id'> & {
  roles: { id: number; name: string }[];
  sessionId: Session['id'];
  iat: number;
  exp: number;
};
