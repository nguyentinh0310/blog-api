import { Body, Controller, Post, Res } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { AuthenticationService } from './authentication.service';
import { LoginDto, RegisterDto } from './dto/authentication.dto';

@Controller('authentication')
@ApiBearerAuth('defaultBearerAuth')
@ApiTags('authentication')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Post('register')
  async register(@Body() createUserDto: RegisterDto) {
    return await this.authenticationService.register(createUserDto);
  }

  @Post('login')
  async login(@Body() loginUserDto: LoginDto, @Res({passthrough: true}) res: Response) {
    const user = await this.authenticationService.getAuthenticatedUser(loginUserDto);
    res.cookie("jwt", user.accessToken, {
      httpOnly: true,
      maxAge: 2 * 24 * 60 * 60 * 1000, // 1h
    });
    return user
  }

  @Post('logout')
  public logout(@Res({passthrough: true}) res: Response) {
    res.clearCookie("jwt");
    return {
      message: 'Logout successfully'
    }
  }

  
}
