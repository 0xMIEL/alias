import { IUser } from '../../entities/users/types/userTypes';

declare module 'socket.io' {
  interface Socket {
    user?: IUser;
  }
}
