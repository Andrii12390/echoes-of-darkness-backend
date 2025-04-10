import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

interface CustomRequest extends Request {
    user?: { userId: number };
}

const verifyToken = (req: CustomRequest, res: Response, next: NextFunction): any => {
    const token = req.cookies.authToken;
    
    if (!token) {
        return res.status(401).json({ message: "Missing token" });
    }

    const cookieOptionsToClear = { 
      httpOnly: true,
      secure: false,
      sameSite: 'lax' as 'lax',
      path: '/'
    };

    if (!token) {
      return res.status(401).json({ message: 'Unauthorized: token is not provided' });
    }

    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET!) as { userId: number; iat: number; exp: number };

      if (!payload || typeof payload.userId !== 'number') {
          res.clearCookie('authToken', cookieOptionsToClear);
          
          return res.status(401).json({ message: 'Unauthorized: Invalid token payload' });
      }

      req.user = { userId: payload.userId };
      
      next(); 
    } catch (e)  {
      res.clearCookie('authToken', cookieOptionsToClear);
      return res.status(401).json({ message: 'Unauthorized: Invalid or expired token' });
    }
}

export { verifyToken, CustomRequest }
