import { NextFunction, Request, Response, Router } from 'express';
import AuthService from '../services/auth-service';

const authRouter = Router();
const authService = new AuthService();

authRouter.post('/register', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      res.status(400).send('Registration: missing parameters');
    }

    const user = await authService.registerUser(username, email, password);
    
    if (!user) {
      res.status(400).send('Registration: error creating user');
    }

    res.status(201).json(user);

  } catch (e) {
    next(e);
  }
});

authRouter.post('/login', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).send('Registration: missing parameters');
    }

    const token = await authService.loginUser(email, password);

    if (!token) {
      res.status(401).send('Login: invalid credentials');
    }

    res.status(200).json({ token });
  } catch (e) {
    next(e);
  }
});

export default authRouter;