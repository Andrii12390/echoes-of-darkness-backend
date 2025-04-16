import { NextFunction, Request, Response, Router } from 'express';
import { verifyToken } from '../middlewares/protected-route';
import UserService from '../services/user-service';

const userRouter = Router();

const userService = new UserService();

userRouter.patch(
  '/profile',
  verifyToken,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, username, password, avatarUrl } = req.body;
      if (!username && !password && !avatarUrl) {
        res.status(400).send('Profile: missing parameters');
      }

      const updatedUser = await userService.updateProfile(
        email,
        username,
        password,
        avatarUrl
      );

      if (!updatedUser) {
        res.status(400).send('Profile: user profile update error');
        return;
      }

      res.status(200).json(updatedUser);
    } catch (e) {
      next(e);
    }
  }
);

export default userRouter;
