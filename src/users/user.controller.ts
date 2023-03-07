import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { RequestWithUser } from 'src/types/authentication.interface';
import { JwtAuthGuard } from 'src/utils/jwt-auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role } from './role.enum';
import RoleGuard from './roles.guard';
import { UserService } from './user.service';

@Controller('users')
@ApiBearerAuth('defaultBearerAuth')
@ApiTags('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Req() req: RequestWithUser) {
    return req.user;
  }

  @Get()
  @UseGuards(RoleGuard(Role.Admin))
  async findAll() {
    return await this.userService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findByid(@Param('id') id: string) {
    return await this.userService.getByUserId(id);
  }

  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: UpdateUserDto,
  })
  @Put(':id')
  @UseGuards(RoleGuard(Role.Admin))
  @UseInterceptors(FileInterceptor('avatar'))
  async updateUser(
    @Param('id') id: string,
    @Body() userDto: UpdateUserDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return await this.userService.updateUser(id, userDto, file);
  }

  @Delete(':id')
  @UseGuards(RoleGuard(Role.Admin))
  async deleteUser(@Param('id') id: string, @Req() req: RequestWithUser) {
    return await this.userService.deleteUser(id, req.user.id);
  }
}
