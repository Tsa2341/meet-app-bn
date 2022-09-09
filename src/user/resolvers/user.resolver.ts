import { join } from 'path';
import { RegisterInput } from './../models/registerInput';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { GlobalClass } from 'src/global';
import { Roles, SkipGuards } from '../../custom.decorator';
import { PrismaService } from '../../prisma.service';
import { PayloadDto } from '../dto/payload.dto';
import { Role } from '../models/role.model';
import { User } from '../models/user.model';
import { LoginInput } from './../models/loginInput';
import { LoginResponse } from './../models/loginResponse';
import { UserService } from './../user.service';
import { createWriteStream } from 'fs';

@Resolver(() => User)
export class UserResolver {
  constructor(
    private prisma: PrismaService,
    private global: GlobalClass,
    private userService: UserService,
  ) {}

  @Mutation(() => LoginResponse)
  @SkipGuards('AuthGuard')
  async loginUser(@Args('loginInput') { email, password }: LoginInput) {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: { role: true },
    });

    if (!User) {
      throw new BadRequestException('Invalid credentials');
    }

    if (!UserService.verifyPassword(password, user?.password as string)) {
      throw new BadRequestException('Invalid credentials');
    }

    const token = this.userService.signToken({
      id: user?.id,
      email: user?.email,
      role: user?.role.name,
    } as PayloadDto);

    return {
      token,
      user,
    };
  }

  @Mutation(() => User)
  @SkipGuards('AuthGuard')
  async registerUser(@Args('avatar') { avatar }: RegisterInput) {
    const { createReadStream, filename } = await avatar;
    return new Promise(async (resolve) => {
      createReadStream()
        .pipe(
          createWriteStream(join(process.cwd(), `./src/upload/${filename}`)),
        )
        .on('finish', () =>
          resolve({
            image: filename,
          }),
        )
        .on('error', () => {
          new UnauthorizedException('Could not save image');
        });
    });
  }

  @Query(() => User)
  async getOneUser() {
    console.log(this.global, 'global in getoneuser');
    return this.prisma.user.findUnique({
      where: { id: this.global.userId },
      include: {
        role: true,
      },
    });
  }

  @Query(() => [User])
  @Roles('SUPER_ADMIN')
  async getAllUsers() {
    return this.prisma.user.findMany({ include: { role: true } });
  }

  @ResolveField(() => Role)
  @SkipGuards('AuthGuard')
  async role(@Parent() user: User) {
    return this.prisma.role.findUnique({ where: { id: user.roleId } });
  }
}
