var express = require('express');
var router = express.Router();

// Import controllers.
var product_controller = require('../controllers/productController');

/// INDEX ///

// GET inventory home page (overview).
router.get('/', product_controller.overview);

/// PRODUCT ROUTES ///

// GET for listing products.
router.get('/products', product_controller.product_list);

// GET for creating product.
router.get('/products/create', product_controller.product_create_get);

/// VENDOR ROUTES ///


module.exports = router;