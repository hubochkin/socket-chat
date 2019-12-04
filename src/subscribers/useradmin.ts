import { Container } from 'typedi';
import { EventSubscriber, On } from 'event-dispatch';
import events from './events';
import { IUserAdmin } from '../interfaces/IUserAdmin';
import mongoose from 'mongoose';

@EventSubscriber()
export default class UserSubscriber {

  @On(events.user.signIn)
  public onUserSignIn({ _id }: Partial<IUserAdmin>) {
    const Logger = Container.get('logger');

    try {
      const UserModel = Container.get('UserAdminModel') as mongoose.Model<IUserAdmin & mongoose.Document>;

      UserModel.update({ _id }, { $set: { lastLogin: new Date() } });
    } catch (e) {
      Logger.error(`🔥 Error on event ${events.user.signIn}: %o`, e);

      // Throw the error so the process die (check src/app.ts)
      throw e;
    }
  }
  @On(events.user.signUp)
  public onUserSignUp({ name, email, _id }: Partial<IUserAdmin>) {
    const Logger = Container.get('logger');

    try {
      /**
       * @TODO implement this
       */
      // Call the tracker tool so your  know that there is a new signup
      
    } catch (e) {
      Logger.error(`🔥 Error on event ${events.user.signUp}: %o`, e);

      // Throw the error so the process dies (check src/app.ts)
      throw e;
    }
  }
}
