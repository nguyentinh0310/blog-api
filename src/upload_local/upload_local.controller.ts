import {
  BadRequestException,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiTags
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/utils/jwt-auth.guard';
import { FileUploadDto } from './dto/upload_local.dto';
import { UploadLocalService } from './upload_local.service';

@ApiTags('file-local')
@Controller('file-local')
export class UploadLocalController {
  constructor(private readonly uploadLocalService: UploadLocalService) {}

  @Get()
  async findAll() {
    return await this.uploadLocalService.findAll();
  }

  @Post('upload')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: FileUploadDto,
  })
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }
    return await this.uploadLocalService.uploadFile(file);
  }

  @Delete('/delete-all')
  @UseGuards(JwtAuthGuard)
  async deleteAllFile() {
    await this.uploadLocalService.deleteAllFile();
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteFile(@Param('id') id: string) {
    await this.uploadLocalService.deleteFile(id);
  }
}
