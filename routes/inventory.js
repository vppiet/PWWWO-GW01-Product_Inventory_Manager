var express = require('express');
var router = express.Router();

// Import controllers.
var product_controller = require('../controllers/productController');

/// INDEX ///

// GET inventory home page (overview).
router.get('/', product_controller.overview);

/// PRODUCT ROUTES ///


/// VENDOR ROUTES ///


module.exports = router;