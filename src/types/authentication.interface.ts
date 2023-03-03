import UserEntity from "src/users/user.entity";

export interface TokenPayLoad {
  expireIn: string;
  accessToken: string;
}

export interface RequestWithUser extends Request {
  user: UserEntity;
}
