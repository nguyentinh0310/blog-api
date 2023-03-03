import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PostgresErrorCode } from 'src/enum';
import { UserService } from 'src/users/user.service';
import { LoginDto, RegisterDto } from './dto/authentication.dto';

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
      const token = this._createToken(createdUser.id);
      createdUser.password = undefined;
      return {
        ...createdUser,
        ...token,
      };
    } catch (error) {
      if (error?.code === PostgresErrorCode.UniqueViolation) {
        throw new HttpException(
          'User with that email already exists',
          HttpStatus.BAD_REQUEST,
        );
      }
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
      const token = this._createToken(user.id);

      if (!isPasswordMaching)
        throw new HttpException(
          'Wrong credentials provided',
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

  private  _createToken(userId: string) {
    const accessToken = this.jwtService.sign({ id: userId });

    return {
      expireIn: process.env.EXPIRESIN,
      accessToken,
    };
  }
}
