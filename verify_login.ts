
import { prisma } from './server/db';
import bcrypt from 'bcryptjs';

async function verify() {
  const email = 'admin@yapee.com';
  const password = 'admin123';

  console.log(`Checking user: ${email}`);
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    console.log('User not found!');
    return;
  }

  console.log('User found:', user.id, user.role);
  console.log('Stored hash:', user.password);

  const isValid = await bcrypt.compare(password, user.password);
  console.log('Is password valid?', isValid);
}

verify()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
