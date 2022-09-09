import { AppService } from 'src/app.service';
import { GlobalClass } from './../../global';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Observable } from 'rxjs';
import { UserService } from '../user.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private userService: UserService,
    private global: GlobalClass,
    private appService: AppService,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const token = ctx.getContext().req.headers.authorization
      ? ctx.getContext().req.headers.authorization.split(' ')[1]
      : null;

    this.global.set('token', token);

    // Will skip this guard if needed
    if (this.appService.getMetaData('Guards', context)?.includes('AuthGuard')) {
      return true;
    }

    if (!token) {
      throw new UnauthorizedException(
        'Not logged in, Please loggin to continue',
      );
    }

    const { email, id, role } = this.userService.verifyToken(token);
    this.global.set('userEmail', email);
    this.global.set('userId', id);
    this.global.set('userRole', role);

    return true;
  }
}
