import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import * as jwt from 'jsonwebtoken';
import { Repository } from 'typeorm';
import { CreateMovieDto, UpdateMovieDto } from './dto/create-movie.dto';
import { Movie } from './movie.entity';



@Injectable()
export class MoviesService {
  constructor(
    @InjectRepository(Movie)
    private readonly movieRepository: Repository<Movie>,

  ) {}


  async create(createMovieDto: CreateMovieDto) {

    const response = await axios.get('https://swapi.dev/api/films/');
    const filmsArray = await response.data.results;
    const found_film = await filmsArray.find((film: { title: string; }) => film.title == createMovieDto.title)


    if (found_film){
      return { message: `The title: ${found_film.title}, is already used in the Star Wars Saga. Please choose a different title for your movie!!` };
    } else {

      const movie = this.movieRepository.create(createMovieDto);
      return this.movieRepository.save(movie);
    }
  }



  async getStarWarsMovies() {
    const response = await axios.get('https://swapi.dev/api/films/');
    return response.data;
  }

  async getSingleFilm(filmId: number) {
    try {
      const response = await axios.get(`https://swapi.dev/api/films/${filmId}/`);
      return response.data;
    } catch (error) {
      throw new Error('Error fetching data from Star Wars API');
    }
  }

   testJwt() {
    const s3cre3t = "jwt OK"
    const payload = { username: "Cosme Fulanito", sub: 1086, role: "Admin" };

      return jwt.sign(payload, s3cre3t , { expiresIn: '60m' });
  }

   async remove(id: string) {
   return await this.movieRepository.delete(id);
  }

  async update(id: string, updateMovieDto: UpdateMovieDto) {
    await this.movieRepository.update(id, updateMovieDto);
  }

}

