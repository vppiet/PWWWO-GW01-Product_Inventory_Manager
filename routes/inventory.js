var express = require('express');
var router = express.Router();

// Import controllers.
var product_controller = require('../controllers/productController');

/// INDEX ///
// GET for inventory home page (overview).
router.get('/', product_controller.overview);

/// PRODUCT ROUTES ///
// GET:     create a product.
router.get('/product/create', product_controller.product_create_get);
// POST:    create a product.
router.post('/product/create', product_controller.product_create_post);
//// GET:     delete a product
//router.get('/product/:id/delete', product_controller.product_delete_get);
//// POST:    delete a product
//router.get('/product/:id/', product_controller.product_delete_post);
// GET:     update a product
router.get('/product/:id/update', product_controller.product_update_get);
//// POST:    update a product
//router.post('/product/:id/update', product_controller.product_update_post);
//// GET:     product details
router.get('/product/:id', product_controller.product_detail);
// GET:     list products.
router.get('/product', product_controller.product_list);

/// CATEGORY ROUTES ///


/// VENDOR ROUTES ///


/// PRODUCER ROUTES ///


module.exports = router;