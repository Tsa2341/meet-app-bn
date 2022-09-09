import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Role } from './role.model';

@ObjectType()
export class User {
  @Field()
  id: string;

  @Field()
  email: string;

  @Field()
  userName: string;

  @Field()
  avatar: string;

  @Field(() => Int)
  roleId: number;

  @Field(() => Role)
  role: Role;
}
