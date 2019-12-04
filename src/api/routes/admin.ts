import { Router, Request, Response } from 'express';
import middlewares from '../middlewares';
import config from '../../config';
const route = Router();


export default (app: Router) => {
  const secret = config.jwtSecretAdmin
  
  app.use('/admins', route);
  route.get('/me',middlewares.isAuth(secret), middlewares.attachCurrentUser, (req: Request, res: Response) => {
    return res.json({ user: req.currentUser }).status(200);
  });
};
