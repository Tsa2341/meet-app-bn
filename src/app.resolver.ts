import { Resolver, Query } from '@nestjs/graphql';
import { SkipGuards } from './custom.decorator';

@Resolver(() => String)
export class AppResolver {
  @Query(() => String)
  @SkipGuards('AuthGuard')
  welcome() {
    return 'Welcome to the meet app apis';
  }
}
