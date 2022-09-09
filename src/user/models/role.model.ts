import { Field, ObjectType, Int } from '@nestjs/graphql';
import { User } from './user.model';

@ObjectType()
export class Role {
  @Field(() => Int)
  id: number;

  @Field()
  name: string;

  @Field(() => [User], { nullable: 'items' })
  user: User[];
}
