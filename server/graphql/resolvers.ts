import { productService } from '../services/product.service.ts';
import { orderService } from '../services/order.service.ts';
import { authService } from '../services/auth.service.ts';
import { prisma } from '../db.ts';

export const resolvers = {
  Query: {
    products: async (_: unknown, args: { page?: number; limit?: number; category?: string; brand?: string; search?: string }) => {
      const page = args.page || 1;
      const limit = args.limit || 10;
      const category = args.category;
      const brand = args.brand;
      const search = args.search;

      const validatedQuery = productService.validatePaginationQuery({
        page: page.toString(),
        limit: limit.toString(),
        category,
        brand,
        search,
      });

      return await productService.getProducts(validatedQuery);
    },

    product: async (_: unknown, args: { id: string }) => {
      const product = await productService.getProductById(args.id);
      if (!product) {
        throw new Error('Product not found');
      }
      return { ...product, tags: JSON.parse(product.tags) };
    },

    orders: async (_: unknown, args: { userId?: string }) => {
      return await orderService.getOrders(args.userId);
    },

    order: async (_: unknown, args: { id: string }) => {
      const orders = await orderService.getOrders();
      const order = orders.find((o) => o.id === args.id);
      if (!order) {
        throw new Error('Order not found');
      }
      return order;
    },

    me: async (_: unknown, __: unknown, context: { user?: { id: string } }) => {
      if (!context.user) {
        throw new Error('Not authenticated');
      }
      const user = await prisma.user.findUnique({
        where: { id: context.user.id },
        include: { orders: true },
      });
      if (!user) {
        throw new Error('User not found');
      }
      return user;
    },
  },

  Mutation: {
    createProduct: async (_: unknown, args: { input: { name: string; brand: string; category: string; price: number; originalPrice?: number; discount?: string; image: string; rating?: number; reviews?: number; tags?: string[] } }) => {
      const validatedData = productService.validateCreateProduct(args.input);
      const product = await productService.createProduct(validatedData);
      return { ...product, tags: JSON.parse(product.tags) };
    },

    updateProduct: async (_: unknown, args: { id: string; input: { name?: string; brand?: string; category?: string; price?: number; originalPrice?: number; discount?: string; image?: string; rating?: number; reviews?: number; tags?: string[] } }) => {
      const validatedData = productService.validateUpdateProduct(args.input);
      const product = await productService.updateProduct(args.id, validatedData);
      return { ...product, tags: JSON.parse(product.tags) };
    },

    deleteProduct: async (_: unknown, args: { id: string }) => {
      await productService.deleteProduct(args.id);
      return true;
    },

    createOrder: async (_: unknown, args: { input: { items: { productId: string; quantity: number; selectedSize?: string; selectedColor?: string }[]; shippingAddress: string; paymentMethod: string } }, context: { user?: { id: string } }) => {
      if (!context.user) {
        throw new Error('Not authenticated');
      }
      const validatedInput = orderService.validateOrderInput(args.input);
      const order = await orderService.createOrder({
        userId: context.user.id,
        ...validatedInput,
      });
      return order;
    },

    updateOrderStatus: async (_: unknown, args: { id: string; status: string }) => {
      const order = await orderService.updateOrderStatus(args.id, args.status);
      if (!order) {
        throw new Error('Order not found');
      }
      return order;
    },

    login: async (_: unknown, args: { input: { email: string; password: string } }) => {
      const validatedInput = authService.validateLoginInput(args.input);
      const result = await authService.login(validatedInput);
      if (!result) {
        throw new Error('Invalid email or password');
      }
      return result;
    },

    updateProfile: async (_: unknown, args: { input: { name?: string; location?: string; avatar?: string; phone?: string } }, context: { user?: { id: string } }) => {
      if (!context.user) {
        throw new Error('Not authenticated');
      }
      const updatedUser = await authService.updateProfile(context.user.id, args.input);
      return updatedUser;
    },
  },

  User: {
    orders: async (parent: { id: string }) => {
      return await prisma.order.findMany({
        where: { userId: parent.id },
        include: { items: { include: { product: true } } },
        orderBy: { date: 'desc' },
      });
    },
  },

  Order: {
    user: async (parent: { userId: string }) => {
      return await prisma.user.findUnique({
        where: { id: parent.userId },
      });
    },

    items: async (parent: { id: string }) => {
      return await prisma.orderItem.findMany({
        where: { orderId: parent.id },
        include: { product: true },
      });
    },
  },

  OrderItem: {
    product: async (parent: { productId: string }) => {
      const product = await prisma.product.findUnique({
        where: { id: parent.productId },
      });
      if (!product) {
        throw new Error('Product not found');
      }
      return { ...product, tags: JSON.parse(product.tags) };
    },
  },
};
