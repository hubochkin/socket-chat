import { Document, Model } from 'mongoose';
import { IUser } from '../../interfaces/IUser';
import { IUserAdmin } from '../../interfaces/IUserAdmin';
import { IMessage } from '../../interfaces/IMessage';
declare global {
  namespace Express {
    export interface Request {
      currentUser: IUser & Document;
    }    
  }

  namespace Models {
    export type UserModel = Model<IUser & Document>;
    export type UserAdminModel = Model<IUserAdmin & Document>;
    export type ChatModel = Model<IMessage & Document>;

  }
}
