import { RoleResolver } from './resolvers/role.resolver';
import { UserResolver } from './resolvers/user.resolver';
import { Module } from '@nestjs/common';

@Module({
  imports: [],
  providers: [UserResolver, RoleResolver],
})
export class UserModule {}
