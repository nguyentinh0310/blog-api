import { Body, Controller, HttpCode, Post, Res } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { AuthenticationService } from './authentication.service';
import {
  LoginDto,
  RefreshTokenDto,
  RegisterDto,
} from './dto/authentication.dto';

@Controller('authentication')
@ApiBearerAuth('defaultBearerAuth')
@ApiTags('authentication')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Post('register')
  async register(@Body() createUserDto: RegisterDto): Promise<any> {
    return await this.authenticationService.register(createUserDto);
  }

  @Post('login')
  @HttpCode(200)
  async login(
    @Body() loginUserDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<any> {
    const user =
      await this.authenticationService.getAuthenticatedUser(loginUserDto);
    res.cookie('jwt', user.accessToken, {
      httpOnly: true,
      maxAge: 1 * 60 * 60 * 1000, // 1h
    });
    return user;
  }

  @Post('logout')
  public logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('jwt');
    return {
      message: 'Logout successfully',
    };
  }

  @Post('refresh_token')
  async refreshToken(
    @Body() { refresh_token }: RefreshTokenDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const token = await this.authenticationService.refreshToken(refresh_token);
    res.cookie('jwt', token.accessToken, {
      httpOnly: true,
      maxAge: 1 * 60 * 60 * 1000, // 1h
    });

    return token;
  }
}
