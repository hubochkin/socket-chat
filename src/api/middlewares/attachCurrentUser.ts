import { Container } from 'typedi';
import mongoose from 'mongoose';
import { IUser } from '../../interfaces/IUser';
import { IUserAdmin } from '../../interfaces/IUserAdmin';

/**
 * Attach user to req.user
 * @param {*} req Express req Object
 * @param {*} res  Express res Object
 * @param {*} next  Express next Function
 */
const attachCurrentUser = async (req, res, next) => {
  const Logger = Container.get('logger');
  try {
    let UserModel = null;
   
    if (!req.token.isAdmin) {
      UserModel = Container.get('userModel') as mongoose.Model<IUser & mongoose.Document>;
    } else {
      UserModel = Container.get('userAdminModel') as mongoose.Model<IUserAdmin & mongoose.Document>;
    }
    const userRecord = await UserModel.findById(req.token._id);
    if (!userRecord) {
      return res.sendStatus(401);
    }
    const currentUser = userRecord.toObject();

    Reflect.deleteProperty(currentUser, 'password');
    req.currentUser = currentUser;

    return next();
  } catch (e) {
    Logger.error('🔥 Error attaching user to req: %o', e);
    return next(e);
  }
};

export default attachCurrentUser;
