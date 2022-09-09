import { SetMetadata } from '@nestjs/common';

export const Roles = (...roles: string[]) => SetMetadata('Roles', roles);

// Decorates a field that wants to skip a specific guard
// Use: THe guard in its full name
export const SkipGuards = (...guards: string[]) => {
  return SetMetadata('Guards', guards);
};
