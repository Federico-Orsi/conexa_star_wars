import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { CreateMovieDto, UpdateMovieDto } from './dto/create-movie.dto';
import { MoviesService } from './movies.service';

@Controller('star-wars')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}


  @Get("all")
  allMovies(){
    return this.moviesService.getStarWarsMovies();
  }


  @Get('single/:id')
  async getFilm(@Param('id') id: string) {
    const filmId = parseInt(id, 10);
    return this.moviesService.getSingleFilm(filmId);
  }


  @Get("test")
  testJwt(): any{
    return this.moviesService.testJwt();
  }

  @Post()
  create(@Body() createMovieDto: CreateMovieDto) {
    return this.moviesService.create(createMovieDto);
  }


  @Delete('remove/:id')
  remove(@Param('id') id: string) {
    return this.moviesService.remove(id);
  }

  @Put('update/:id')
  update(@Param('id') id: string, @Body() updateMovieDto: UpdateMovieDto) {
    return this.moviesService.update(id, updateMovieDto);
  }


}










