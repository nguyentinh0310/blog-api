import {
  CanActivate,
  ExecutionContext, mixin,
  Type
} from '@nestjs/common';
import { RequestWithUser } from './../types/authentication.interface';
import { JwtAuthGuard } from './../utils/jwt-auth.guard';
import { Role } from './role.enum';


// CanActivate: có được phép truy cập tài nguyên hay không -> true || false
const RoleGuard = (role: Role): Type<CanActivate> => {
  class RoleGuardMixin extends JwtAuthGuard {
    // context để kiểm tra quyền truy cập của người dùng
    async canActivate(context: ExecutionContext) {
      await super.canActivate(context);

      const request = context.switchToHttp().getRequest<RequestWithUser>();
      const user = request.user;

      return user?.roles.includes(role);
    }
  }

  return mixin(RoleGuardMixin);
};

export default RoleGuard;
