import { Router } from 'express';
import auth from './routes/auth';
import user from './routes/user';
import admin from './routes/admin';
import agendash from './routes/agendash';
import authadmin from './routes/authadmin';


// guaranteed to get dependencies
export default () => {
	const app = Router();
	auth(app);
	authadmin(app);
	user(app);
	admin(app);
	agendash(app);
	

	return app
}