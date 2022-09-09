import { ConfigService } from '@nestjs/config';
import { RoleGuard } from './user/guards/role.guard';
import { PrismaService } from './prisma.service';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AuthGuard } from './user/guards/user.guard';
import { UserService } from './user/user.service';
import { GlobalClass } from './global';
import { AppService } from './app.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const prismaService = app.get(PrismaService);
  const userService = app.get(UserService);
  const global = app.get(GlobalClass);
  const appService = app.get(AppService);
  const env = app.get(ConfigService);

  app.useGlobalGuards(
    new AuthGuard(userService, global, appService),
    new RoleGuard(global, appService),
  );
  await prismaService.enableShutdownHooks(app);

  const port = env.get('PORT') ? parseInt(env.get('PORT') as string, 10) : 4000;
  await app.listen(port);
}
bootstrap();
