import { Service, Inject } from 'typedi';
import jwt from 'jsonwebtoken';
import config from '../config';
import { IUserAdmin, IUserAdminInputDTO } from '../interfaces/IUserAdmin';
import { EventDispatcher, EventDispatcherInterface } from '../decorators/eventDispatcher';
import events from '../subscribers/events';
import utils from '../decorators/utils';

@Service()
export default class AuthService {
  constructor(
    @Inject('userAdminModel') private userAdminModel: Models.UserAdminModel,
    // private mailer: MailerService,
    @Inject('logger') private logger,
    @EventDispatcher() private eventDispatcher: EventDispatcherInterface,
  ) { }

  public async SignUp(userInputDTO: IUserAdminInputDTO): Promise<{ user: IUserAdmin; token: string }> {
    try {


       */
      this.logger.silly('Hashing password');
        //change hash here
      const hashedPassword = await utils.generateHash(userInputDTO.password.trim());

      this.logger.silly('Creating user db record');
      const userRecord = await this.userAdminModel.create({
        ...userInputDTO,

        password: hashedPassword,
      });
      this.logger.silly('Generating JWT');
      const token = this.generateToken(userRecord);

      if (!userRecord) {
        throw new Error('User cannot be created');
      }
      this.logger.silly('Sending welcome email');
      // await this.mailer.SendWelcomeEmail(userRecord);

      this.eventDispatcher.dispatch(events.user.signUp, { user: userRecord });

      const user = userRecord.toObject();
      Reflect.deleteProperty(user, 'password');

      return { user, token };
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  public async SignIn(email: string, password: string): Promise<{ user: IUserAdmin; token: string }> {
    const userRecord = await this.userAdminModel.findOne({ email });
    if (!userRecord) {
      throw new Error('User not registered');
    }
    /**
     * We use verify from argon2 to prevent 'timing based' attacks
     */
    this.logger.silly('Checking password');

    const validPassword = await utils.checkHash(password, userRecord.password);
    if (validPassword) {
      this.logger.silly('Password is valid!');
      this.logger.silly('Generating JWT');
      const token = this.generateToken(userRecord);
      const user = userRecord.toObject();
      Reflect.deleteProperty(user, 'password');

      /**
       * Easy as pie, you don't need passport.js anymore :)
       */
      return { user, token };
    } else {
      throw new Error('Invalid Password');
    }
  }

  private generateToken(user) {
    const today = new Date();
    const exp = new Date(today);
    exp.setDate(today.getDate() + 60);

    /**
     * A JWT means JSON Web Token, so basically it's a json that is _hashed_ into a string
     * The cool thing is that you can add custom properties a.k.a metadata
     * Here we are adding the userId, role and name
     * Beware that the metadata is public and can be decoded without _the secret_
     * but the client cannot craft a JWT to fake a userId
     * because it doesn't have _the secret_ to sign it
     * more information here: https://softwareontheroad.com/you-dont-need-passport
     */
    this.logger.silly(`Sign JWT for userId: ${user._id}`);
    return jwt.sign(
      {
        _id: user._id, // We are gonna use this in the middleware 'isAuth'
        role: user.role,
        name: user.name,
        isAdmin: user.isAdmin,
        exp: exp.getTime() / 1000,
      },
      config.jwtSecretAdmin,
    );
  }
}
