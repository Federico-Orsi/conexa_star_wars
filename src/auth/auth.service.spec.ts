import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcryptjs';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            findOne: jest.fn(),
            create: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('test_token'),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('validateUser', () => {
    // it('should return user data without password if validation is successful', async () => {
    //   const user = { id: 1, username: 'Federico Orsi', password: '123', role: "Administrador" };
    //   jest.spyOn(usersService, 'findOne').mockResolvedValue(user);

    //   const result = await authService.validateUser('Federico Orsi', '123');
    //   expect(result).toEqual(user);
    // });

    it('should return null if validation fails', async () => {
      jest.spyOn(usersService, 'findOne').mockResolvedValue(null);

      const result = await authService.validateUser('test', 'test');
      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    it('should return an access token', async () => {
      const loginDto: LoginDto = { username: 'test', password: '123', id: 1, role: 'user' };
      const result = await authService.login(loginDto);
      expect(result).toEqual({ access_token: 'test_token' });
    });
  });

  describe('register', () => {
    it('should return the created user', async () => {
      const signupDto: SignupDto = {
          username: 'Federico Orsi',
          password: '123',
          role: 'Administrador'
      };
      const createdUser = { id: 1, ...signupDto, password: bcrypt.hashSync(signupDto.password, 8) };
      jest.spyOn(usersService, 'create').mockResolvedValue(createdUser);

      const result = await authService.register(signupDto);
      expect(result).toEqual(createdUser);
    });
  });
});
