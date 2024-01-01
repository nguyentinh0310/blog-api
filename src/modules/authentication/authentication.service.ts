import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { env } from 'src/config/enviroment';
import { UserService } from '../users/user.service';
import {
  LoginDto,
  RegisterDto
} from './dto/authentication.dto';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}
  async register(registerDto: RegisterDto) {
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    try {
      const createdUser = await this.userService.createUser({
        ...registerDto,
        password: hashedPassword,
      });
      createdUser.password = undefined;
      return createdUser;
    } catch (error) {
      console.error(error)
      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAuthenticatedUser({ email, password }: LoginDto) {
    try {
      const user = await this.userService.getByEmail(email);
      const isPasswordMaching = await bcrypt.compare(password, user.password);
      const token = await this._createToken(user.id);

      if (!isPasswordMaching)
        throw new HttpException(
          'Password is not correct',
          HttpStatus.BAD_REQUEST,
        );
      user.password = undefined;
      return {
        ...user,
        ...token,
      };
    } catch (error) {
      throw new HttpException(
        'Wrong credentials provided',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async validateUser(userId: string) {
    const user = await this.userService.getByUserId(userId);
    user.password = undefined;
    if (!user) {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }
    return user;
  }

  async refreshToken(refresh_token: string): Promise<any> {
    try {
      const verify = await this.jwtService.verify(refresh_token, {
        secret: env.SECRETKEY_REFRESH,
      });
      const userId = verify.id;
      const isCheckToken = await this.userService.checkExitsToken(
        userId,
        refresh_token,
      );
      if (isCheckToken) {
        return await this._createToken(userId);
      } else {
        throw new HttpException(
          'Refresh token is not valid',
          HttpStatus.BAD_REQUEST,
        );
      }
    } catch (error) {
      throw new HttpException(
        'Refresh token is not valid',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  private async _createToken(userId: string) {
    const accessToken = this.jwtService.sign({ id: userId });
    const refreshToken = this.jwtService.sign(
      { id: userId },
      {
        secret: env.SECRETKEY_REFRESH,
        expiresIn: env.EXPIRESIN_REFRESH,
      },
    );
    await this.userService.updateToken(userId, refreshToken);
    return {
      expireIn: env.EXPIRESIN,
      accessToken,
      refreshToken,
    };
  }
}
