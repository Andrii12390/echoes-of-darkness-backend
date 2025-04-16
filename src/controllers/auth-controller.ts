import { NextFunction, Request, Response, Router } from 'express';

import AuthService from '../services/auth-service';

import { OAuth2Client } from 'google-auth-library';
import { verifyToken, CustomRequest } from '../middlewares/protected-route';
import { COOKIE_OPTIONS } from '../constants';

const authRouter = Router();
const authService = new AuthService();

authRouter.post(
  '/register',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { username, email, password } = req.body;
      if (!username || !email || !password) {
        res.status(400).send('Registration: missing parameters');
      }

      const [user, token] = await authService.registerUser(
        username,
        email,
        password
      );

      if (!user) {
        res.status(400).send('Registration: error creating user');
        return;
      }

      res.cookie('authToken', token, COOKIE_OPTIONS);
      res.status(201).json(await authService.getSafeUserById(user.id));
    } catch (e) {
      next(e);
    }
  }
);

authRouter.post(
  '/login',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        res.status(400).send('Registration: missing parameters');
      }

      const [user, token] = await authService.loginWithCredentials(
        email,
        password
      );

      if (!token) {
        res.status(401).send('Login: invalid credentials');
        return;
      }

      res.cookie('authToken', token, COOKIE_OPTIONS);

      res.status(200).json(await authService.getSafeUserById(user.id));
    } catch (e) {
      next(e);
    }
  }
);

authRouter.get(
  '/google',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const redirectUrl = 'http://localhost:5000/api/v1/auth/google/callback';

      const oAuth2Client = new OAuth2Client(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        redirectUrl
      );

      const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: ['openid', 'profile', 'email'],
        prompt: 'consent',
      });

      res.json({ url: authUrl });
    } catch (e) {
      next(e);
    }
  }
);

authRouter.get(
  '/google/callback',
  async (req: Request, res: Response, next: NextFunction) => {
    const code = req.query.code as string;
    const redirectUrl = 'http://localhost:5000/api/v1/auth/google/callback';

    if (!code)
      return res.redirect(
        `${process.env.FRONTEND_URL}/login?error=google_no_code`
      );

    try {
      const oAuth2Client = new OAuth2Client(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        redirectUrl
      );

      const response = await oAuth2Client.getToken(code);
      const idToken = response.tokens.id_token;

      if (!idToken) {
        throw new Error('Login[google]: failed to get id_token from Google');
      }

      const ticket = await oAuth2Client.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();
      if (!payload || !payload.sub || !payload.email) {
        throw new Error('Login[google]: invalid Google token');
      }

      const token = await authService.loginWithGoogle({
        googleId: payload.sub,
        email: payload.email,
        username: payload.name!,
        avatarUrl: payload.picture || undefined,
      });

      res.cookie('authToken', token, COOKIE_OPTIONS);
      res.redirect(process.env.FRONTEND_URL!);
    } catch (e) {
      next(e);
      res.redirect(
        `${process.env.FRONTEND_URL}/login?error=google_auth_failed`
      );
    }
  }
);

authRouter.get(
  '/me',
  verifyToken,
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.userId;

      const user = await authService.getSafeUserById(userId);

      if (!user) {
        res.clearCookie('authToken', COOKIE_OPTIONS);
        res.status(404).json({ message: 'Auth: user not found' });
        return;
      }

      res.status(200).json(user);
    } catch (e) {
      next(e);
    }
  }
);

authRouter.post('/logout', (req: Request, res: Response) => {
  res.clearCookie('authToken', COOKIE_OPTIONS);
  res.status(200).json({ message: 'Auth: successfully logout' });
});

export default authRouter;
