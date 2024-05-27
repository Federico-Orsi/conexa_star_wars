import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OnlyAdmin, OnlyRegularUser } from '../common/middlewares/roles.middleware';
import { Movie } from './movie.entity';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';

@Module({
  imports: [TypeOrmModule.forFeature([Movie])],
  providers: [MoviesService],
  controllers: [MoviesController],
})
export class MoviesModule implements NestModule {

  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(OnlyRegularUser)
      .forRoutes('star-wars/single/:id');

      consumer
      .apply(OnlyAdmin)
      .forRoutes({ path: 'star-wars', method: RequestMethod.POST });

      consumer
      .apply(OnlyAdmin)
      .forRoutes({ path: 'star-wars/remove/:id', method: RequestMethod.DELETE });

      consumer
      .apply(OnlyAdmin)
      .forRoutes({ path: 'star-wars/update/:id', method: RequestMethod.PUT });
    }
}
