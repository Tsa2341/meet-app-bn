import { UserService } from './../../src/user/user.service';
// import * as bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

export default async function main() {
  const { user, role } = prisma;

  await role.create({
    data: {
      name: 'SUPER_ADMIN',
    },
  });
  await role.create({
    data: {
      name: 'USER',
    },
  });

  await user.create({
    data: {
      id: uuidv4(),
      email: 'SUPER_ADMIN@gmail.com',
      avatar: '',
      userName: 'superAdmin',
      password: UserService.hashPassword('SUPER_ADMIN2gmail'),
      roleId: (
        await role.findUnique({
          where: { name: 'SUPER_ADMIN' },
        })
      )?.id as number,
    },
  });
  await user.create({
    data: {
      id: uuidv4(),
      email: 'USER@gmail.com',
      avatar: '',
      userName: 'user',
      password: UserService.hashPassword('USER2gmail'),
      roleId: (
        await role.findUnique({
          where: { name: 'USER' },
        })
      )?.id as number,
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e, 'in seeds');
    await prisma.$disconnect();
    process.exit(1);
  });
