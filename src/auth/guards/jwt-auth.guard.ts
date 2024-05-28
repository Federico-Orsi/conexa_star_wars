import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import * as bcrypt from 'bcryptjs';
import { UsersService } from 'src/users/users.service';



@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly usersService: UsersService, private reflector: Reflector) {
      super();
  }

    async canActivate(context: ExecutionContext) {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();

    // const header = request.headers['authorization']
    const { username, password } = request.body;

    if (!username || !password) {
      throw new UnauthorizedException('Credenciales de autenticación incompletas');
    }

    const user = await this.usersService.findOne(username);

    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      throw new UnauthorizedException('Credenciales de autenticación inválidas');
    }


     return true;
  }
}


