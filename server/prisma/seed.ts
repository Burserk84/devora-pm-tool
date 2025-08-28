import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('Ceo@sharifi', 10);

  const superadmin = await prisma.user.upsert({
    where: { email: 'your-email@example.com' },
    update: {},
    create: {
      email: 'sharifiasldev@gmail.com', 
      name: 'Amirali Sharifi Asl',      
      password: hashedPassword,          
      role: 'SUPERADMIN',             
    },
  });
  console.log({ superadmin });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });