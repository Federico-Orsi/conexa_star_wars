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

    let hello = 'Vamooooooo!! Come on Nest!!';

    it('should return "Vamooooooo!! Come on Nest!!"', () => {
      expect(appController.getHello()).toBe('Vamooooooo!! Come on Nest!!');
    });

    it('should be the same of: "Hello variable"', () => {
      expect(appController.getHello()).toEqual(hello);
    });
  });
});
