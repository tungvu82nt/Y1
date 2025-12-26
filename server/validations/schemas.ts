import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  location: z.string().optional(),
  phone: z.string().optional(),
});

export const productCreateSchema = z.object({
  name: z.string().min(2, 'Product name must be at least 2 characters'),
  brand: z.string().min(1, 'Brand is required'),
  category: z.string().min(1, 'Category is required'),
  price: z.number().positive('Price must be positive'),
  originalPrice: z.number().positive().optional(),
  discount: z.string().optional(),
  image: z.string().url('Invalid image URL').optional(),
  rating: z.number().min(0).max(5).optional(),
  reviews: z.number().int().min(0).optional(),
  tags: z.array(z.string()).optional(),
});

export const productUpdateSchema = productCreateSchema.partial();

export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  category: z.string().optional(),
  brand: z.string().optional(),
  minPrice: z.coerce.number().positive().optional(),
  maxPrice: z.coerce.number().positive().optional(),
  sortBy: z.enum(['price', 'rating', 'createdAt']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});

export const orderCreateSchema = z.object({
  shippingAddress: z.string().min(10, 'Shipping address is too short'),
  paymentMethod: z.string().min(1, 'Payment method is required'),
  estimatedDelivery: z.string().optional(),
});

export const cartItemSchema = z.object({
  productId: z.string().uuid('Invalid product ID'),
  quantity: z.number().int().positive('Quantity must be at least 1'),
  selectedSize: z.string().min(1, 'Size is required'),
  selectedColor: z.string().min(1, 'Color is required'),
});

export const updateProfileSchema = z.object({
  name: z.string().min(2).optional(),
  location: z.string().optional(),
  phone: z.string().optional(),
  avatar: z.string().url().optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ProductCreateInput = z.infer<typeof productCreateSchema>;
export type ProductUpdateInput = z.infer<typeof productUpdateSchema>;
export type PaginationInput = z.infer<typeof paginationSchema>;
export type OrderCreateInput = z.infer<typeof orderCreateSchema>;
export type CartItemInput = z.infer<typeof cartItemSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
