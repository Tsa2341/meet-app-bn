import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { AppService } from './../../app.service';
import { GlobalClass } from './../../global';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private global: GlobalClass, private appService: AppService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const roles = this.appService.getMetaData('Roles', context);

    // Will skip this guard if needed
    if (this.appService.getMetaData('Guards', context)?.includes('RoleGuard')) {
      return true;
    }

    if (!roles) {
      return true;
    }

    if (!roles?.includes(this.global.userRole)) {
      throw new UnauthorizedException(
        'You are not allowed to perfom this action!',
      );
    }

    return true;
  }
}
