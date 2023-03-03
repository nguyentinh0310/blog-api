import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RequestWithUser } from 'src/types/authentication.interface';
import { JwtAuthGuard } from 'src/utils/jwt-auth.guard';
import { UserService } from './user.service';

@Controller('users')
@ApiBearerAuth('defaultBearerAuth')
@ApiTags('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Req() req: RequestWithUser) {
    return req.user;
  }
}
