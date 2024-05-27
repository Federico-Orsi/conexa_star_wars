import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NextFunction, Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { UserRole } from 'src/enums/roles.enum';

@Injectable()
export class OnlyRegularUser implements NestMiddleware {

  constructor(private readonly configService: ConfigService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('No token provided');
    }


    try {
      const decoded = jwt.verify(token, this.configService.get<string>('JWT_SECRET'));
      const userRole = decoded['role'];

      if (userRole !== UserRole.RegularUser) {
        throw new UnauthorizedException(`This resource is only available for ${UserRole.RegularUser}`);
      }

      req['user'] = decoded;
      next();
    } catch (error) {
      throw new UnauthorizedException('This resource is only available for Regular Users');
    }
  }
}


@Injectable()
export class OnlyAdmin implements NestMiddleware {

  constructor(private readonly configService: ConfigService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    try {
      const decoded = jwt.verify(token, this.configService.get<string>('JWT_SECRET'));
      const userRole = decoded['role'];

      if (userRole !== UserRole.Admin) {
        throw new UnauthorizedException(`This resource is only available for ${UserRole.Admin}`);
      }

      req['user'] = decoded;
      next();
    } catch (error) {
      throw new UnauthorizedException(`This resource is only available for ${UserRole.Admin}`);
    }
  }
}

