import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import UserEntity from './user.entity';
import { UploadLocalService } from '../upload_local/upload_local.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private readonly fileService: UploadLocalService,
  ) {}

  async findAll(): Promise<UserEntity[]> {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.avatar', 'avatar')
      .select(['user', 'avatar.id', 'avatar.filename', 'avatar.path'])
      .getMany();

    return user;
  }

  async createUser(userData: CreateUserDto): Promise<UserEntity> {
    const newUser = await this.userRepository.create(userData);
    await this.userRepository.save(newUser);
    return newUser;
  }

  async getByEmail(email: string) {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.avatar', 'avatar')
      .where('user.email= :email', { email })
      .select([
        'user.id',
        'user.email',
        'user.name',
        'user.avatar',
        'user.password',
        'avatar.id',
        'avatar.filename',
        'avatar.path',
      ])
      .getOne();
    if (!user) {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }
    return user;
  }

  async getByUserId(userId: string): Promise<UserEntity> {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.avatar', 'avatar')
      .where('user.id= :id', { id: userId })
      .select(['user', 'avatar.id', 'avatar.filename', 'avatar.path'])
      .getOne();
    if (!user) {
      throw new HttpException('User does not exits', HttpStatus.BAD_REQUEST);
    }
    return user;
  }

  async updateUser(
    userId: string,
    userData: UpdateUserDto,
    file?: Express.Multer.File,
  ): Promise<UserEntity> {
    const user = await this.getByUserId(userId);

    if (file) {
      const uploadedFile = await this.fileService.uploadFile(file);
      userData.avatar = uploadedFile;
      userData.avatarId = uploadedFile.id;
    }

    Object.assign(user, userData);
    userData.updatedAt = new Date();

    return await this.userRepository.save(user);
  }

  async deleteUser(id: string, userId: string): Promise<DeleteResult> {
    const user = await this.getByUserId(id);
    if (user.id === userId) {
      throw new HttpException(
        'You are not delete myself',
        HttpStatus.FORBIDDEN,
      );
    }
    return await this.userRepository.delete({ id });
  }

  async updateToken(userId: string, refresh_token: string) {
    try {
      return this.userRepository.update({ id: userId }, { refresh_token });
    } catch (error) {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }
  }

  async checkExitsToken(userId: string, refresh_token: string) {
    try {
      return this.userRepository.findOneBy({ id: userId, refresh_token });
    } catch (error) {
      throw new HttpException('Invalid token', HttpStatus.BAD_REQUEST);
    }
  }
}
