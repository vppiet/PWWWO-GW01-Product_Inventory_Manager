var express = require('express');
var router = express.Router();

// Import controllers.
var product_controller = require('../controllers/productController');
var producer_controller = require('../controllers/producerController');
var productcategory_controller = require ('../controllers/productcategoryController.js');

/// INDEX ///
// GET for inventory home page (overview).
router.get('/', product_controller.overview);

/// PRODUCT ROUTES ///
// GET:     create a product.
router.get('/product/create', product_controller.product_create_get);
// POST:    create a product.
router.post('/product/create', product_controller.product_create_post);
//// POST:    delete a product
router.post('/product/:id/delete', product_controller.product_delete_post);
// GET:     update a product
router.get('/product/:id/update', product_controller.product_update_get);
//// POST:    update a product
router.post('/product/:id/update', product_controller.product_update_post);
//// GET:     product details
router.get('/product/:id', product_controller.product_detail);
// GET:     list products.
router.get('/product', product_controller.product_list);

/// CATEGORY ROUTES ///
// GET:     create a product category.
router.get('/productcategory/create', productcategory_controller.productcategory_create_get);
// POST:    create a product category.
router.post('/productcategory/create', productcategory_controller.productcategory_create_post);
//// POST:    delete a product category.
router.post('/productcategory/:id/delete', productcategory_controller.productcategory_delete_post);
// GET:     update a product category.
router.get('/productcategory/:id/update', productcategory_controller.productcategory_update_get);
//// POST:    update a product category.
router.post('/productcategory/:id/update', productcategory_controller.productcategory_update_post);
//// GET:     product category details.
router.get('/productcategory/:id', productcategory_controller.productcategory_detail);
// GET:     list product categories.
router.get('/productcategory', productcategory_controller.productcategory_list);

/// VENDOR ROUTES ///


/// PRODUCER ROUTES ///
// GET:     create a producer
router.get('/producer/create', producer_controller.producer_create_get);
// POST:    create a producer
router.post('/producer/create', producer_controller.producer_create_post);
//// GET:     delete a producer
//router.get('/producer/:id/delete', producer_controller.producer_delete_get);
//// POST:    delete a producer
//router.get('/producer/:id/', producer_controller.producer_delete_post);
// GET:     update a producer
router.get('/producer/:id/update', producer_controller.producer_update_get);
//// POST:    update a producer
//router.post('/producer/:id/update', producer_controller.producer_update_post);
//// GET:     producer details
router.get('/producer/:id', producer_controller.producer_detail);
// GET:     list producers
router.get('/producer', producer_controller.producer_list);

module.exports = router;
