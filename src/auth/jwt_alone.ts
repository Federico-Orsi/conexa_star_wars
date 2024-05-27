import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';


@Injectable()
export class JwtService {
  private readonly secret = 'yourSecretKey';

  sign(payload: any): string {
    return jwt.sign(payload, this.secret, { expiresIn: '60m' });
  }

  verify(token: string): any {
    try {
      return jwt.verify(token, this.secret);
    } catch (error) {
      throw new Error('Invalid token');
    }
  }
}