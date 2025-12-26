import express from 'express';
import { createProduct, getProductById, getProducts, updateProduct, deleteProduct } from '../controllers/product.controller.ts';
import { protect, admin } from '../middleware/auth.middleware.ts';
import { validate } from '../validations/index.ts';
import { productCreateSchema, productUpdateSchema, paginationSchema } from '../validations/schemas.ts';

const router = express.Router();

router.get('/', validate(paginationSchema), getProducts);
router.get('/:id', getProductById);
router.post('/', protect, admin, validate(productCreateSchema), createProduct);
router.put('/:id', protect, admin, validate(productUpdateSchema), updateProduct);
router.delete('/:id', protect, admin, deleteProduct);

export default router;
