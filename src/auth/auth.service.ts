import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UserRole } from 'src/enums/roles.enum';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(username);
    if (user && bcrypt.compareSync(pass, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: LoginDto) {

    const found_user = await this.usersService.findOne(user.username);
    const payload = { username: found_user.username, role: found_user.role };

    return {
      access_token: this.jwtService.sign(payload),

    };
  }

  async register(user: SignupDto) {

    if (user.role == UserRole.Admin || user.role == UserRole.RegularUser || user.role == undefined){

    const hashedPassword = bcrypt.hashSync(user.password, 8);
    user.password = hashedPassword;
    return this.usersService.create(user);
    } else{
      throw new UnauthorizedException('Sorry, the only roles available to register a new User are: Administrador or Usuario Regular');
    }
  }
}
