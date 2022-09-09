import { Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { Roles, SkipGuards } from 'src/custom.decorator';
import { PrismaService } from '../../prisma.service';
import { Role } from '../models/role.model';
import { User } from '../models/user.model';

@Resolver(() => Role)
export class RoleResolver {
  constructor(private prisma: PrismaService) {}

  @Query(() => [Role])
  @Roles('SUPER_ADMIN')
  async getAllRoles() {
    return this.prisma.role.findMany({});
  }

  @ResolveField(() => [User])
  @SkipGuards('AuthGuard')
  async user(@Parent() role: Role) {
    return this.prisma.user.findMany({
      where: { roleId: role.id },
    });
  }
}
