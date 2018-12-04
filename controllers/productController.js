var Product = require('../models/product');
var ProductCategory = require('../models/productcategory');
var Producer = require('../models/producer');
var Vendor = require('../models/vendor');

var async = require('async');

const { body, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');


// Overview: Display counts of collections.
module.exports.overview = (req, res, next) => {

    async.parallel({
        product_count: (callback) => {
            Product.countDocuments(callback);
        },
        productcategory_count: (callback) => {
            ProductCategory.countDocuments(callback);
        },
        producer_count: (callback) => {
            Producer.countDocuments(callback);
        },
        vendor_count: (callback) => {
            Vendor.countDocuments(callback);
        }
    }, (err, results) => {
        if (err) { return next(err); }

        res.render('overview', { title: 'Overview', data: results });
    });

};

// List all products.
module.exports.product_list = (req, res, next) => {

    Product.find({})
    .populate('category')
    .populate('vendor')
    .populate('producer')
    .exec((err, results) => {
        if (err) { return next(err); }

        res.render('product_list', { title: 'Products', products: results });
    });

};

// Display form for creating a product.
module.exports.product_create_get = (req, res, next) => {

    async.parallel({
        categories: (callback) => {
            ProductCategory.find(callback)
        },
        vendors: (callback) => {
            Vendor.find(callback)
        },
        producers: (callback) => {
            Producer.find(callback)
        }
    }, (err, results) => {
        if (err) { return next(err); }

        res.render('product_form', { title: 'Create Product', categories: results.categories, vendors: results.vendors, producers: results.producers });
    });

};

// Validate, sanitize and save submitted product.
// Return an array of middleware to router.
module.exports.product_create_post = [
    // Validate.
    body('name', 'Invalid value for Name.')
        .trim()
        .isLength({ min: 1, max: 100 }).withMessage('Name must be at least one character and most 100 characters long.')
        .isAlphanumeric().withMessage('Name must contain only alphanumerics.'),

    body('category', 'Invalid value for Category.')
        .isMongoId(),

    body('description', 'Invalid value for Description.')
        .trim()
        .isLength({ max: 1000 }).withMessage('Description should be at most 1000 characters long.'), // optional field: no min

    body('in_stock', 'Invalid value for In Stock.')
        .isInt().withMessage('In Stock must be an integer.')
        .isInt({ min: 0 }).withMessage('In Stock must be equal or greater than zero.'),

    body('units_in_package', 'Invalid value for Units in Package.')
        .isInt().withMessage('Units in Package must be an integer.')
        .isInt({ min: 1 }).withMessage('Units In Package must be equal or greater than one.'),

    body('vendor', 'Invalid value for Vendor.')
        .isMongoId(),

    body('producer', 'Invalid value for Producer.')
        .isMongoId(),

    // Sanitize.
    sanitizeBody('*').trim().escape(),

    // Process request.
    (req, res, next) => {
        const errors = validationResult(req);

        let product = new Product({
            name:               req.body.name,
            category:           req.body.category,
            in_stock:           req.body.in_stock,
            units_in_package:   req.body.units_in_package,
            vendor:             req.body.vendor,
            producer:           req.body.producer
        });

        if (req.body.description) { product.description = req.body.description }

        if (!errors.isEmpty()) {
            // Errors found.

            async.parallel({
                categories: (callback) => {
                    ProductCategory.find(callback);
                },
                vendors: (callback) => {
                    Vendor.find(callback);
                },
                producers: (callback) => {
                    Producer.find(callback);
                }
            }, (err, results) => {
                if (err) { return next(err); }

                res.render('product_form', { title: 'Create Product', errors: errors.array(), product: product, categories: results.categories, vendors: results.vendors, producers: results.producers });
            });
            return;
        }
        else {
            // Form data is valid. Save product.
            product.save((err) => {
                if (err) { return next(err) };
                res.redirect('/inventory/product/' + product._id);
            });
        }
    }
];

// Display product details.
module.exports.product_detail = (req, res, next) => {
    Product.findById(req.params.id)
    .populate('category')
    .populate('vendor')
    .populate('producer')
    .exec((err, product) => {
        if (err) { return next(err); }

        if (product == null) {
            var err = new Error('Product not found.');
            err.status = 404;
            return next(err);
        }

        res.render('product_detail', { title: 'Product Detail: ' + product._id, product: product });
    });
};

// Display form for updating a product.
module.exports.product_update_get = (req, res, next) => {

    async.parallel({
        product: (callback) => {
            Product.findById(req.params.id)
            .populate('category')
            .populate('vendor')
            .populate('producer')
            .exec(callback)
        },
        categories: (callback) => {
            ProductCategory.find(callback);
        },
        vendors: (callback) => {
            Vendor.find(callback);
        },
        producers: (callback) => {
            Producer.find(callback);
        }
    }, (err, results) => {
        if (err) { return next(err); }

        if (results.product == null) {
            var err = new Error('Product not found.');
            err.status = 404;
            return next(err);
        }

        res.render('product_form', { title: 'Update Product: ' + results.product._id, product: results.product, categories: results.categories, vendors: results.vendors, producers: results.producers });
    });
};

// Validate, sanitize and save updated product.
// Return an array of middlewares to router.
module.exports.product_update_post = [
    // Validate.
    body('name', 'Invalid value for Name.')
    .trim()
    .isLength({ min: 1, max: 100 }).withMessage('Name must be at least one character and most 100 characters long.')
    .isAlphanumeric().withMessage('Name must contain only alphanumerics.'),

    body('category', 'Invalid value for Category.')
        .isMongoId(),

    body('description', 'Invalid value for Description.')
        .trim()
        .isLength({ max: 1000 }).withMessage('Description should be at most 1000 characters long.'), // optional field: no min

    body('in_stock', 'Invalid value for In Stock.')
        .isInt().withMessage('In Stock must be an integer.')
        .isInt({ min: 0 }).withMessage('In Stock must be equal or greater than zero.'),

    body('units_in_package', 'Invalid value for Units in Package.')
        .isInt().withMessage('Units in Package must be an integer.')
        .isInt({ min: 1 }).withMessage('Units In Package must be equal or greater than one.'),

    body('vendor', 'Invalid value for Vendor.')
        .isMongoId(),

    body('producer', 'Invalid value for Producer.')
        .isMongoId(),

    // Sanitize.
    sanitizeBody('*').trim().escape(),

    // Process request.
    (req, res, next) => {
        const errors = validationResult(req);

        var product = new Product({
            name:               req.body.name,
            category:           req.body.category,
            description:        (req.body.description) ? req.body.description : null,
            in_stock:           req.body.in_stock,
            units_in_package:   req.body.units_in_package,
            vendor:             req.body.vendor,
            producer:           req.body.producer,
            _id:                req.params.id
        });

        if(!errors.isEmpty()) {

            async.parallel({
                categories: (callback) => {
                    ProductCategory.find(callback);
                },
                vendors: (callback) => {
                    Vendor.find(callback);
                },
                producers: (callback) => {
                    Producer.find(callback);
                }
            }, (err, results) => {
                if (err) { return next(err); }

                res.render('product_form', { title: 'Update Product: ' + product._id, errors: errors, categories: results.categories, vendors: results.vendors, producers: results.producers });
            })
        }
        else {
            // Check for in_stock change and update stock_last_updated with current Date.
            Product.findById(req.params.id, 'in_stock')
            .exec((err, results) => {
                if (err) { return next(err); }

                if (req.body.in_stock != results.in_stock) {
                    product.in_stock = req.body.in_stock;
                    product.stock_last_updated = Date.now();
                }

                // Update product.
                Product.findByIdAndUpdate(req.params.id, product)
                .exec((err) => {
                    if (err) { return next(err); }

                    res.redirect(product.url);
                });
            });
        }
    }
];

// Delete product
module.exports.product_delete_post = (req, res, next) => {
    Product.findByIdAndDelete(req.body.id, (err) => {
        if (err) { next(err); }
        res.json({ redirect: '/inventory/product'});
    });
}