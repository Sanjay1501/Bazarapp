import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import { UsersService } from 'src/users/users.service';
import { UserEntity } from 'src/users/entities/user.entity';

declare global {
  namespace Express {
    interface Request {
      currentUser?: UserEntity;
    }
  }
}

@Injectable()
export class CurrentMiddleware implements NestMiddleware {
  constructor(private readonly userService: UsersService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization || req.headers.Authorization;

    if (!authHeader || typeof authHeader !== 'string' || !authHeader.startsWith('Bearer ')) {
      req.currentUser = null;
      return next();
    }

    const token = authHeader.split(' ')[1]; // Extract the token

    
    try {
      const { id } =<JwtPayload> verify(token, process.env.ACCESS_TOKEN_SECRET_KEY) as { id: number }; // Assuming `id` is a number
      const currentUser = await this.userService.findOne(id);
      if (!currentUser) {
        return res.status(401).json({ message: 'User not found' });
      }
      console.log(currentUser);
      req.currentUser = currentUser;
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Invalid token' });
    }
  }
}


interface JwtPayload {
    id: number;  
  }
  