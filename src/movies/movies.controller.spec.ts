import { Test, TestingModule } from '@nestjs/testing';
import { CreateMovieDto } from './dto/create-movie.dto';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';

describe('MoviesController', () => {
  let controller: MoviesController;
  let service: MoviesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MoviesController],
      providers: [
        {
          provide: MoviesService,
          useValue: {
            create: jest.fn().mockResolvedValue({ id: 1, title: 'Test Movie' }),
            getStarWarsMovies: jest.fn().mockResolvedValue([]),
            getSingleFilm: jest.fn().mockResolvedValue({}),
            testJwt: jest.fn().mockReturnValue('test_jwt'),
          },
        },
      ],
    }).compile();

    controller = module.get<MoviesController>(MoviesController);
    service = module.get<MoviesService>(MoviesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a movie', async () => {
    const createMovieDto: CreateMovieDto = {
      title: 'Test Movie',
      description: 'Test',
      releaseDate: new Date('2024-05-27'),
      director: 'Martin Scorcese'
    };
    expect(await controller.create(createMovieDto)).toEqual({ id: 1, title: 'Test Movie' });
  });

  it('should get all Star Wars movies', async () => {
    expect(await controller.allMovies()).toEqual([]);
  });

  it('should get a single film by id', async () => {
    expect(await controller.getFilm('1')).toEqual({});
  });

  it('should return a test JWT', () => {
    expect(controller.testJwt()).toBe('test_jwt');
  });
});
