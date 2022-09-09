import { GraphQLUpload } from 'graphql-upload-cjs';
import { FileUpload } from './fileUpload';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class RegisterInput {
  // @Field()
  // id: string;

  // @Field()
  // email: string;

  // @Field()
  // userName: string;

  @Field(() => GraphQLUpload)
  avatar: Promise<FileUpload>;

  // @Field()
  // role: string;
}
