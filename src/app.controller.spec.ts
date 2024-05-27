import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';


describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {

    let hello = 'Vamooooooo!! Nest lpmqtrmp!';

    it('should return "Vamooooooo!! Nest lpmqtrmp!"', () => {
      expect(appController.getHello()).toBe('Vamooooooo!! Nest lpmqtrmp!');
    });

    it('should be the same of: "Hello variable"', () => {
      expect(appController.getHello()).toEqual(hello);
    });
  });
});
