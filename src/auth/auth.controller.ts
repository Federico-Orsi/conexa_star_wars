import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(JwtAuthGuard )
  @Post('login')
  async login(@Body() login_dto: LoginDto ) {
    return this.authService.login(login_dto);
  }

  @Post('register')
  async register(@Body() user: SignupDto) {
    return this.authService.register(user);
  }
}
