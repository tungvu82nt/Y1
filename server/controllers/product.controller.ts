import { Request, Response } from 'express';
import { productService } from '../services/product.service.ts';
import { z } from 'zod';
import { ApiError } from '../middleware/error.middleware.ts';

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}

export const getProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const validatedQuery = productService.validatePaginationQuery(req.query);
    const result = await productService.getProducts(validatedQuery);
    res.json(result);
  } catch (error: unknown) {
    if (error instanceof ApiError) {
      res.status(error.statusCode).json({
        success: false,
        error: {
          code: error.code,
          message: error.message,
        },
      });
      return;
    }
    if (error instanceof z.ZodError) {
      throw ApiError.badRequest('VALIDATION_ERROR', 'Validation failed', error.issues);
    }
    console.error('Error fetching products:', error);
    throw ApiError.internal('Failed to fetch products');
  }
};

export const getProductById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const product = await productService.getProductById(id);

    if (!product) {
      throw ApiError.notFound('PRODUCT_NOT_FOUND', 'Product not found');
    }

    res.json({
      success: true,
      data: product,
    });
  } catch (error: unknown) {
    if (error instanceof ApiError) {
      res.status(error.statusCode).json({
        success: false,
        error: {
          code: error.code,
          message: error.message,
        },
      });
      return;
    }
    console.error('Error fetching product:', error);
    throw ApiError.internal('Failed to fetch product');
  }
};

export const createProduct = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const validatedData = productService.validateCreateProduct(req.body);
    const product = await productService.createProduct(validatedData);

    res.status(201).json({
      success: true,
      data: product,
    });
  } catch (error: unknown) {
    if (error instanceof ApiError) {
      res.status(error.statusCode).json({
        success: false,
        error: {
          code: error.code,
          message: error.message,
        },
      });
      return;
    }
    if (error instanceof z.ZodError) {
      throw ApiError.badRequest('VALIDATION_ERROR', 'Validation failed', error.issues);
    }
    console.error('Error creating product:', error);
    throw ApiError.internal('Failed to create product');
  }
};

export const updateProduct = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const validatedData = productService.validateUpdateProduct(req.body);
    const product = await productService.updateProduct(id, validatedData);

    res.json({
      success: true,
      data: product,
    });
  } catch (error: unknown) {
    if (error instanceof ApiError) {
      res.status(error.statusCode).json({
        success: false,
        error: {
          code: error.code,
          message: error.message,
        },
      });
      return;
    }
    if (error instanceof z.ZodError) {
      throw ApiError.badRequest('VALIDATION_ERROR', 'Validation failed', error.issues);
    }
    console.error('Error updating product:', error);
    throw ApiError.internal('Failed to update product');
  }
};

export const deleteProduct = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await productService.deleteProduct(id);

    res.json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error: unknown) {
    if (error instanceof ApiError) {
      res.status(error.statusCode).json({
        success: false,
        error: {
          code: error.code,
          message: error.message,
        },
      });
      return;
    }
    console.error('Error deleting product:', error);
    throw ApiError.internal('Failed to delete product');
  }
};
