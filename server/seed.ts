
import { PrismaClient } from '@prisma/client';
import { PRODUCTS, USER } from '../constants.js'; // Ensure constants.ts is treated as module

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seeding...');

  // Seed Products
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();

  console.log('🧹 Cleaned database');

  for (const p of PRODUCTS) {
    await prisma.product.create({
      data: {
        id: p.id,
        name: p.name,
        brand: p.brand,
        category: p.category,
        price: p.price,
        originalPrice: p.originalPrice,
        discount: p.discount,
        image: p.image,
        rating: p.rating || 0,
        reviews: p.reviews || 0,
        tags: p.tags || []
      }
    });
  }
  console.log(`✅ Seeded ${PRODUCTS.length} products`);

  // Seed Admin User
  await prisma.user.create({
    data: {
      email: 'admin@yapee.com',
      password: 'hashed_secret', // Demo
      name: 'System Admin',
      role: 'admin',
      location: 'Yapee HQ',
      avatar: 'https://ui-avatars.com/api/?name=Admin&background=ed1d23&color=fff',
      isVip: true,
      memberSince: '2020'
    }
  });

  // Seed Demo Customer
  await prisma.user.create({
    data: {
      email: 'alex@example.com',
      password: 'password123',
      name: USER.name,
      avatar: USER.avatar,
      location: USER.location,
      role: 'customer',
      memberSince: USER.memberSince,
      isVip: USER.isVip,
      phone: '+1 (555) 123-4567'
    }
  });

  console.log('✅ Seeded users');
}

main()
  .catch((e) => {
    console.error(e);
    // Explicitly cast process to any to avoid "Property 'exit' does not exist on type 'Process'" error
    (process as any).exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
