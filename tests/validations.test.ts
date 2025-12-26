import { describe, it, expect } from 'vitest';
import {
  loginSchema,
  registerSchema,
  productCreateSchema,
  productUpdateSchema,
  paginationSchema,
  cartItemSchema,
  updateProfileSchema,
} from '../server/validations/schemas';

describe('Validation Schemas', () => {
  describe('loginSchema', () => {
    it('should validate correct login input', () => {
      const validInput = { email: 'test@example.com', password: 'password123' };
      const result = loginSchema.safeParse(validInput);
      expect(result.success).toBe(true);
    });

    it('should reject invalid email', () => {
      const invalidInput = { email: 'invalid-email', password: 'password123' };
      const result = loginSchema.safeParse(invalidInput);
      expect(result.success).toBe(false);
    });

    it('should reject short password', () => {
      const invalidInput = { email: 'test@example.com', password: '123' };
      const result = loginSchema.safeParse(invalidInput);
      expect(result.success).toBe(false);
    });
  });

  describe('registerSchema', () => {
    it('should validate correct register input', () => {
      const validInput = {
        email: 'user@example.com',
        password: 'password123',
        name: 'John Doe',
        location: 'New York',
      };
      const result = registerSchema.safeParse(validInput);
      expect(result.success).toBe(true);
    });

    it('should accept optional fields', () => {
      const minimalInput = {
        email: 'user@example.com',
        password: 'password123',
      };
      const result = registerSchema.safeParse(minimalInput);
      expect(result.success).toBe(true);
    });

    it('should reject short name', () => {
      const invalidInput = {
        email: 'user@example.com',
        password: 'password123',
        name: 'J',
      };
      const result = registerSchema.safeParse(invalidInput);
      expect(result.success).toBe(false);
    });
  });

  describe('productCreateSchema', () => {
    it('should validate correct product input', () => {
      const validProduct = {
        name: 'Running Shoes',
        brand: 'Nike',
        category: 'Running',
        price: 99.99,
        originalPrice: 129.99,
        image: 'https://example.com/image.jpg',
        rating: 4.5,
        reviews: 100,
        tags: ['new', 'sale'],
      };
      const result = productCreateSchema.safeParse(validProduct);
      expect(result.success).toBe(true);
    });

    it('should reject missing required fields', () => {
      const invalidProduct = {
        name: 'Shoes',
      };
      const result = productCreateSchema.safeParse(invalidProduct);
      expect(result.success).toBe(false);
    });

    it('should reject negative price', () => {
      const invalidProduct = {
        name: 'Running Shoes',
        brand: 'Nike',
        category: 'Running',
        price: -10,
      };
      const result = productCreateSchema.safeParse(invalidProduct);
      expect(result.success).toBe(false);
    });

    it('should reject invalid image URL', () => {
      const invalidProduct = {
        name: 'Running Shoes',
        brand: 'Nike',
        category: 'Running',
        price: 99.99,
        image: 'not-a-url',
      };
      const result = productCreateSchema.safeParse(invalidProduct);
      expect(result.success).toBe(false);
    });

    it('should reject rating above 5', () => {
      const invalidProduct = {
        name: 'Running Shoes',
        brand: 'Nike',
        category: 'Running',
        price: 99.99,
        rating: 6,
      };
      const result = productCreateSchema.safeParse(invalidProduct);
      expect(result.success).toBe(false);
    });
  });

  describe('productUpdateSchema', () => {
    it('should allow partial updates', () => {
      const partialUpdate = {
        price: 79.99,
      };
      const result = productUpdateSchema.safeParse(partialUpdate);
      expect(result.success).toBe(true);
    });

    it('should allow empty object', () => {
      const emptyUpdate = {};
      const result = productUpdateSchema.safeParse(emptyUpdate);
      expect(result.success).toBe(true);
    });
  });

  describe('paginationSchema', () => {
    it('should validate default pagination', () => {
      const defaultPagination = {};
      const result = paginationSchema.safeParse(defaultPagination);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.page).toBe(1);
        expect(result.data.limit).toBe(10);
      }
    });

    it('should validate custom pagination', () => {
      const customPagination = {
        page: 2,
        limit: 20,
        category: 'Running',
        brand: 'Nike',
        sortBy: 'price',
        sortOrder: 'asc',
      };
      const result = paginationSchema.safeParse(customPagination);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.page).toBe(2);
        expect(result.data.limit).toBe(20);
      }
    });

    it('should reject page less than 1', () => {
      const invalidPagination = { page: 0 };
      const result = paginationSchema.safeParse(invalidPagination);
      expect(result.success).toBe(false);
    });

    it('should reject limit greater than 100', () => {
      const invalidPagination = { limit: 200 };
      const result = paginationSchema.safeParse(invalidPagination);
      expect(result.success).toBe(false);
    });

    it('should reject invalid sortBy value', () => {
      const invalidPagination = { sortBy: 'invalid' };
      const result = paginationSchema.safeParse(invalidPagination);
      expect(result.success).toBe(false);
    });

    it('should parse string numbers correctly', () => {
      const stringPagination = {
        page: '3',
        limit: '15',
      };
      const result = paginationSchema.safeParse(stringPagination);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.page).toBe(3);
        expect(result.data.limit).toBe(15);
      }
    });
  });

  describe('cartItemSchema', () => {
    it('should validate correct cart item', () => {
      const validCartItem = {
        productId: '123e4567-e89b-12d3-a456-426614174000',
        quantity: 2,
        selectedSize: '42',
        selectedColor: 'Black',
      };
      const result = cartItemSchema.safeParse(validCartItem);
      expect(result.success).toBe(true);
    });

    it('should reject invalid UUID', () => {
      const invalidItem = {
        productId: 'not-a-uuid',
        quantity: 1,
        selectedSize: '42',
        selectedColor: 'Black',
      };
      const result = cartItemSchema.safeParse(invalidItem);
      expect(result.success).toBe(false);
    });

    it('should reject zero quantity', () => {
      const invalidItem = {
        productId: '123e4567-e89b-12d3-a456-426614174000',
        quantity: 0,
        selectedSize: '42',
        selectedColor: 'Black',
      };
      const result = cartItemSchema.safeParse(invalidItem);
      expect(result.success).toBe(false);
    });
  });

  describe('updateProfileSchema', () => {
    it('should validate partial profile updates', () => {
      const validUpdate = {
        name: 'John Updated',
        location: 'Los Angeles',
      };
      const result = updateProfileSchema.safeParse(validUpdate);
      expect(result.success).toBe(true);
    });

    it('should reject invalid avatar URL', () => {
      const invalidUpdate = {
        avatar: 'not-an-url',
      };
      const result = updateProfileSchema.safeParse(invalidUpdate);
      expect(result.success).toBe(false);
    });
  });
});
