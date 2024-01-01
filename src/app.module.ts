import { Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { MulterModule } from '@nestjs/platform-express';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from '../db/data-source';
import { AllExceptionsFilter } from './filters/all-exceptions.filter';
import { ArticleModule } from './modules/article/article.module';
import { AuthenticationModule } from './modules/authentication/authentication.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { UploadLocalModule } from './modules/upload_local/upload_local.module';
import { UserModule } from './modules/users/user.module';
import { LoggingInterceptor } from './utils/logging.interceptor';

@Module({
  imports: [
    ConfigModule.forRoot(),
    // TypeOrmModule.forRoot(dataSourceOptions),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule], 
      useFactory: async (configService) => ({
        type: 'postgres',
        host: configService.get('POSTGRES_HOST'),
        ssl: true,
        port: 5432,
        username: configService.get('POSTGRES_USERNAME'),
        password: configService.get('POSTGRES_PASSWORD'),
        database: configService.get('POSTGRES_DATABASE'),
        synchronize: true, // Chỉ sử dụng trong môi trường phát triển
        autoLoadEntities: true,
      }),
      inject: [ConfigService],
    }),
    MulterModule.register({
      dest: './uploads',
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
