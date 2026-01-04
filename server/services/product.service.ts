import { prisma } from '../db.ts';
import { paginationSchema, productCreateSchema, productUpdateSchema } from '../validations/schemas.ts';
import { Prisma, Product } from '@prisma/client';
import { cacheService } from '../config/redis.ts';

interface PaginationResult {
  data: Array<{ [key: string]: unknown }>;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

interface ProductQueryParams {
  page?: number;
  limit?: number;
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: 'price' | 'rating' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

interface CreateProductInput {
  name: string;
  brand: string;
  category: string;
  price: number;
  originalPrice?: number;
  image: string;
  description?: string;
  rating?: number;
  reviews?: number;
  tags?: string[];
}

interface UpdateProductInput extends Partial<CreateProductInput> {}

function formatProduct(product: any): { [key: string]: unknown } {
  return {
    ...product,
    price: product.price ? Number(product.price) : 0,
    originalPrice: product.originalPrice ? Number(product.originalPrice) : null,
  };
}

export const productService = {
  async getProducts(query: ProductQueryParams): Promise<PaginationResult> {
    const { page = 1, limit = 10, category, brand, minPrice, maxPrice, sortBy, sortOrder } = query;

    const cacheKey = `products:${page}:${limit}:${category || 'all'}:${brand || 'all'}:${minPrice || '0'}:${maxPrice || 'max'}:${sortBy || 'createdAt'}:${sortOrder || 'desc'}`;
    
    const cached = await cacheService.get<PaginationResult>(cacheKey);
    if (cached) {
      return cached;
    }

    const skip = (page - 1) * limit;
    const take = limit;

    const where: Prisma.ProductWhereInput = {};

    if (category) {
      where.category = category;
    }

    if (brand) {
      where.brand = brand;
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) {
        (where.price as Prisma.DecimalFilter).gte = minPrice;
      }
      if (maxPrice !== undefined) {
        (where.price as Prisma.DecimalFilter).lte = maxPrice;
      }
    }

    const orderBy: Prisma.ProductOrderByWithRelationInput = {};
    if (sortBy) {
      orderBy[sortBy] = sortOrder || 'desc';
    } else {
      orderBy.createdAt = 'desc';
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take,
        orderBy,
        include: {
          variants: true,
        },
      }),
      prisma.product.count({ where }),
    ]);

    const formattedProducts = products.map(formatProduct);

    const totalPages = Math.ceil(total / limit);

    const result = {
      data: formattedProducts,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };

    await cacheService.set(cacheKey, result, 1800);

    return result;
  },

  async getProductById(id: string): Promise<any | null> {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        variants: true,
      },
    });
    return product ? formatProduct(product) : null;
  },

  async createProduct(data: CreateProductInput): Promise<any> {
    const { tags, ...otherData } = data;
    const product = await prisma.product.create({
      data: {
        ...otherData,
        tags: tags || [],
        updatedAt: new Date(),
      },
      include: {
        variants: true,
      },
    });
    await cacheService.delPattern('products:*');
    return formatProduct(product);
  },

  async updateProduct(id: string, data: UpdateProductInput): Promise<any> {
    const { tags, ...otherData } = data;
    const product = await prisma.product.update({
      where: { id },
      data: {
        ...otherData,
        ...(tags && { tags }),
      },
      include: {
        variants: true,
      },
    });
    await cacheService.delPattern('products:*');
    return formatProduct(product);
  },

  async deleteProduct(id: string): Promise<void> {
    await prisma.product.delete({
      where: { id },
    });
    await cacheService.delPattern('products:*');
  },

  validatePaginationQuery(query: Record<string, unknown>): ProductQueryParams {
    const validated = paginationSchema.parse(query);
    return {
      page: validated.page,
      limit: validated.limit,
      category: validated.category,
      brand: validated.brand,
      minPrice: validated.minPrice,
      maxPrice: validated.maxPrice,
      sortBy: validated.sortBy,
      sortOrder: validated.sortOrder,
    };
  },

  validateCreateProduct(data: unknown): CreateProductInput {
    return productCreateSchema.parse(data) as CreateProductInput;
  },

  validateUpdateProduct(data: unknown): UpdateProductInput {
    return productUpdateSchema.parse(data) as UpdateProductInput;
  },
};
