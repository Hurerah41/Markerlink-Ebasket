const express = require('express');
const {
  listFarmers,
  listCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  updateCustomerStatus,
  archiveProduct,
  removeReview,
  updateFarmer,
  updateFarmerStatus,
  createMarket,
  updateMarket,
  uploadMarketImage,
  deleteMarketImage,
  deleteMarket,
  listOrders,
  getReport,
} = require('../controllers/adminController');
const protect = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const marketImageUpload = require('../middleware/marketImageUpload');

const router = express.Router();

router.use(protect, authorize('admin'));

router.get('/farmers', listFarmers);
router.get('/customers', listCustomers);
router.post('/customers', createCustomer);
router.patch('/customers/:id', updateCustomer);
router.delete('/customers/:id', deleteCustomer);
router.patch('/customers/:id/status', updateCustomerStatus);
router.patch('/products/:id/archive', archiveProduct);
router.delete('/reviews/:id', removeReview);
router.get('/orders', listOrders);
router.get('/reports', getReport);
router.patch('/farmers/:id', updateFarmer);
router.patch('/farmers/:id/status', updateFarmerStatus);
router.post('/markets', createMarket);
router.patch('/markets/:id', updateMarket);
router.post('/markets/:id/image', marketImageUpload.single('image'), uploadMarketImage);
router.delete('/markets/:id/image', deleteMarketImage);
router.delete('/markets/:id', deleteMarket);

module.exports = router;

