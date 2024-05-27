import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import axios from 'axios';
import * as jwt from 'jsonwebtoken';
import { Repository } from 'typeorm';
import { CreateMovieDto } from './dto/create-movie.dto';
import { Movie } from './movie.entity';
import { MoviesService } from './movies.service';

jest.mock('axios');
jest.mock('jsonwebtoken');

describe('MoviesService', () => {
  let service: MoviesService;
  let movieRepository: Repository<Movie>;
  let mockedAxios: jest.Mocked<typeof axios>;

  beforeEach(async () => {
    mockedAxios = axios as jest.Mocked<typeof axios>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MoviesService,
        {
          provide: getRepositoryToken(Movie),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<MoviesService>(MoviesService);
    movieRepository = module.get<Repository<Movie>>(getRepositoryToken(Movie));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should return a message if the title is already used', async () => {
      const createMovieDto: CreateMovieDto = {
        title: 'A New Hope', description: '...',
        releaseDate: new Date('1977-05-25'),
        director: 'Martin Scorcese'
      };

      mockedAxios.get.mockResolvedValue({
        data: {
          results: [
            { title: 'A New Hope' },
            { title: 'The Empire Strikes Back' },
          ],
        },
      });

      const result = await service.create(createMovieDto);

      expect(result).toEqual({ message: 'The title: A New Hope, is already used in the Star Wars Saga. Please choose a different title for your movie!!' });
    });

  });

  describe('getStarWarsMovies', () => {
    it('should return the list of Star Wars movies', async () => {
      const films = [{ title: 'A New Hope' }, { title: 'The Empire Strikes Back' }];

      mockedAxios.get.mockResolvedValue({ data: films });

      const result = await service.getStarWarsMovies();

      expect(result).toEqual(films);
    });
  });

  describe('getSingleFilm', () => {
    it('should return a single film by ID', async () => {
      const film = { title: 'A New Hope' };

      mockedAxios.get.mockResolvedValue({ data: film });

      const result = await service.getSingleFilm(1);

      expect(result).toEqual(film);
    });

    it('should throw an error if the film is not found', async () => {
      mockedAxios.get.mockRejectedValue(new Error('Error fetching data from Star Wars API'));

      await expect(service.getSingleFilm(999)).rejects.toThrow('Error fetching data from Star Wars API');
    });
  });



  describe('testJwt', () => {
    it('should return a signed JWT', () => {
      const payload = { username: 'Cosme Fulanito', sub: 1086, role: 'Admin' };
      const token = 'test_token';

      jest.spyOn(jwt, 'sign').mockImplementation(() => token);

      const result = service.testJwt();

      expect(result).toEqual(token);
      expect(jwt.sign).toHaveBeenCalledWith(payload, 'jwt OK', { expiresIn: '60m' });
    });
  });






});