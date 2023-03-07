import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as fs from 'fs';
import * as mkdirp from 'mkdirp';
import * as path from 'path';
import { Repository } from 'typeorm';
import { UploadLocalEntiy } from './upload_local.entity';

@Injectable()
export class UploadLocalService {
  private MAX_FILE_SIZE = 3 * 1024 * 1024; //3MB
  constructor(
    @InjectRepository(UploadLocalEntiy)
    private readonly fileRepository: Repository<UploadLocalEntiy>,
  ) {}
  async findAll() {
    return await this.fileRepository.find({});
  }

  async uploadFile(file: Express.Multer.File): Promise<UploadLocalEntiy> {
    // check file
    if (file.size > this.MAX_FILE_SIZE) {
      throw new HttpException(
        `File size exceeds the limit of ${this.MAX_FILE_SIZE} MB`,
        HttpStatus.BAD_REQUEST,
      );
    }

    // Check file type
    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (!allowedTypes.includes(file.mimetype)) {
      throw new HttpException(
        `File type ${file.mimetype} is not allowed`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const { originalname, mimetype, buffer } = file;

    const filename = `${Date.now()}-${originalname}`;

    // tạo thư mục upload nếu chưa có
    const uploadDir = './uploads';
    await mkdirp(uploadDir);

    // Lưu file
    const filePath = path.join(uploadDir, filename);
    fs.writeFileSync(filePath, buffer);

    // Lưu database
    const newFile = await this.fileRepository.create({
      filename,
      path: filePath,
      mimetype,
    });
    await this.fileRepository.save(newFile);

    return newFile;
  }

  async deleteFile(id: string): Promise<void> {
    const file = await this.fileRepository.findOne({ where: { id } });
    if (!file)
      throw new HttpException('File does not exist', HttpStatus.NOT_FOUND);

    // Xóa file
    fs.unlinkSync(file.path);

    await this.fileRepository.delete(id);
  }

  async deleteAllFile(): Promise<void> {
    const files = this.fileRepository.find();

    (await files).forEach((file) => {
      fs.unlinkSync(file.path);
    });
    await this.fileRepository.delete({});
  }
}
