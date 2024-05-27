import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';


describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            login: jest.fn(),
            register: jest.fn(),
          },
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  describe('login', () => {
    it('should return an access token', async () => {
      const result = { access_token: 'test_token' };
      const loginDto: LoginDto = {
          username: 'Federico Orsi',
          password: '123',
          id: 1,
          role: 'Administrador'
      };
      jest.spyOn(authService, 'login').mockImplementation(async () => result);

      expect(await authController.login(loginDto)).toBe(result);
    });
  });

  describe('register', () => {
    it('should return the created user', async () => {
      const user: SignupDto = {
          username: 'Federico Orsi',
          password: '123',
          role: 'Administrador'
      };
      const result = { id: 1, ...user };
      jest.spyOn(authService, 'register').mockImplementation(async () => result);

      expect(await authController.register(user)).toBe(result);
    });
  });
});
