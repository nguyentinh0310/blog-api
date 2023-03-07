import { Module } from '@nestjs/common';
import { UploadLocalService } from './upload_local.service';
import { UploadLocalController } from './upload_local.controller';
import { UploadLocalEntiy } from './upload_local.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([UploadLocalEntiy])],
  controllers: [UploadLocalController],
  providers: [UploadLocalService],
  exports: [UploadLocalService],
})
export class UploadLocalModule {}
