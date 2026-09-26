const express = require('express');
const {
  getProducts,
  getProduct,
  getMyProducts,
  createProduct,
  updateProduct,
  archiveProduct,
} = require('../controllers/productController');
const protect = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const approvedFarmer = require('../middleware/approvedFarmer');

const router = express.Router();

router.get('/', getProducts);
router.get('/mine', protect, authorize('farmer'), approvedFarmer, getMyProducts);
router.post('/', protect, authorize('farmer'), approvedFarmer, createProduct);
router.patch('/:id', protect, authorize('farmer'), approvedFarmer, updateProduct);
router.delete('/:id', protect, authorize('farmer'), approvedFarmer, archiveProduct);
router.get('/:id', getProduct);

module.exports = router;

