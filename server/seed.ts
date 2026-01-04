
import { PrismaClient } from '@prisma/client';
import { PRODUCTS, USER } from '../constants.ts';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seeding...');

  // Seed Products
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
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
        tags: p.tags || [],
        createdAt: new Date(),
        updatedAt: new Date(),
        variants: {
          create: [
            { size: 'S', color: 'Black', stock: 10 },
            { size: 'M', color: 'Black', stock: 15 },
            { size: 'L', color: 'Black', stock: 5 },
            { size: 'M', color: 'White', stock: 8 },
            { size: 'L', color: 'White', stock: 12 },
          ]
        }
      }
    });
  }
  console.log(`✅ Seeded ${PRODUCTS.length} products with variants`);

  // Seed Admin User
  const hashedAdminPassword = await bcrypt.hash('admin123', 10);
  await prisma.user.create({
    data: {
      email: 'admin@yapee.com',
      password: hashedAdminPassword,
      name: 'System Admin',
      role: 'ADMIN',
      location: 'Yapee HQ',
      avatar: 'https://ui-avatars.com/api/?name=Admin&background=ed1d23&color=fff',
      isVip: true,
      memberSince: '2020',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  });

  // Seed Demo Customer
  const hashedUserPassword = await bcrypt.hash('password123', 10);
  await prisma.user.create({
    data: {
      email: 'alex@example.com',
      password: hashedUserPassword,
      name: USER.name,
      avatar: USER.avatar,
      location: USER.location,
      role: 'CUSTOMER',
      memberSince: USER.memberSince,
      isVip: USER.isVip,
      phone: '+1 (555) 123-4567',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  });

  console.log('✅ Seeded users');

  // Seed Sample Orders
  const adminUser = await prisma.user.findUnique({ where: { email: 'admin@yapee.com' } });
  const customerUser = await prisma.user.findUnique({ where: { email: 'alex@example.com' } });
  const firstProduct = await prisma.product.findFirst();

  if (adminUser && firstProduct) {
    await prisma.order.create({
      data: {
        userId: adminUser.id,
        subtotal: 199.98,
        tax: 16.00,
        total: 215.98,
        shippingAddress: JSON.stringify({
          street: '123 Admin Street',
          city: 'Admin City',
          state: 'AD',
          zipCode: '12345',
          country: 'USA'
        }),
        paymentMethod: 'credit_card',
        estimatedDelivery: '2025-12-30',
        status: 'PROCESSING',
        date: new Date(),
        updatedAt: new Date(),
        items: {
          create: [
            {
              productId: firstProduct.id,
              quantity: 2,
              selectedSize: 'M',
              selectedColor: 'Black',
              priceAtTime: firstProduct.price
            }
          ]
        }
      }
    });
  }

  if (customerUser && firstProduct) {
    await prisma.order.create({
      data: {
        userId: customerUser.id,
        subtotal: 99.99,
        tax: 8.00,
        total: 107.99,
        shippingAddress: JSON.stringify({
          street: '456 Customer Ave',
          city: 'Customer Town',
          state: 'CT',
          zipCode: '67890',
          country: 'USA'
        }),
        paymentMethod: 'paypal',
        estimatedDelivery: '2025-12-28',
        status: 'SHIPPED',
        date: new Date(Date.now() - 86400000),
        updatedAt: new Date(),
        items: {
          create: [
            {
              productId: firstProduct.id,
              quantity: 1,
              selectedSize: 'L',
              selectedColor: 'White',
              priceAtTime: firstProduct.price
            }
          ]
        }
      }
    });
  }

  console.log('✅ Seeded orders');
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
