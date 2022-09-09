import { GqlExecutionContext } from '@nestjs/graphql';
import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class AppService {
  constructor(private reflector: Reflector) {}

  getHello(): string {
    return 'Hello World!';
  }

  getMetaData(metaDataKey: string, context: ExecutionContext) {
    return this.reflector.get<string[]>(
      metaDataKey,
      GqlExecutionContext.create(context).getHandler(),
    );
  }
}
