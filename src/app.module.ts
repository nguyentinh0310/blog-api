import * as Joi from '@hapi/joi';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { MulterModule } from '@nestjs/platform-express';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ArticleModule } from './article/article.module';
import { AuthenticationModule } from './authentication/authentication.module';
import { CategoriesModule } from './categories/categories.module';
import { DatabaseModule } from './database/database.module';
import { UploadLocalModule } from './upload_local/upload_local.module';
import { UserModule } from './users/user.module';
import { AllExceptionsFilter } from './utils/all-exceptions.filter';
import { LoggingInterceptor } from './utils/logging.interceptor';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        POSTGRES_HOST: Joi.string().required(),
        POSTGRES_PORT: Joi.number().required(),
        POSTGRES_USER: Joi.string().required(),
        POSTGRES_PASSWORD: Joi.string().required(),
        POSTGRES_DB: Joi.string().required(),
        PORT: Joi.number(),
        SECRETKEY: Joi.string().required(),
        EXPIRESIN: Joi.string().required(),
        SECRETKEY_REFRESH: Joi.string().required(),
        EXPIRESIN_REFRESH: Joi.string().required(),
      }),
    }),
    DatabaseModule,
    MulterModule.register({
      dest: './uploads'
    }),
    UserModule,
    AuthenticationModule,
    ArticleModule,
    CategoriesModule,
    UploadLocalModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
 
  ],
})
export class AppModule {}
