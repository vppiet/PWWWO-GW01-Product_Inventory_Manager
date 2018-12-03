var ProductCategory = require('../models/productcategory');

var async = require('async');

const { body, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');


// Overview: Display counts of collections.
module.exports.overview = (req, res, next) => {

    async.parallel({
        productcategory_count: (callback) => {
            ProductCategory.countDocuments(callback);
        }
    }, (err, results) => {
        if (err) { return next(err); }

        res.render('overview', { title: 'Overview', data: results });
    });

};

// List all product categories.
module.exports.productcategory_list = (req, res, next) => {

    ProductCategory.find({})
    .populate('productcategory')
    .exec((err, results) => {
        if (err) { return next(err); }

        res.render('productcategory_list', { title: 'Product Categories', productcategories: results });
    });

};

// Display form for creating a product category.
module.exports.productcategory_create_get = (req, res, next) => {

    async.parallel({
        productcategories: (callback) => {
            ProductCategory.find(callback)
        }
    }, (err, results) => {
        if (err) { return next(err); }

        res.render('productcategory_form', { title: 'Create Product Category', productcategories: results.productcategories });
    });

};

// Validate, sanitize and save submitted product.
// Return an array of middleware to router.
module.exports.productcategory_create_post = [
    // Validate.
    body('name', 'Invalid value for Name.')
        .trim()
        .isLength({ min: 1, max: 100 }).withMessage('Name must be at least one character and most 100 characters long.')
        .isAlphanumeric().withMessage('Name must contain only alphanumerics.'),

    body('description', 'Invalid value for Description.')
        .trim()
        .isLength({ max: 1000 }).withMessage('Description should be at most 1000 characters long.'), // optional field: no min

    // Sanitize.
    sanitizeBody('*').trim().escape(),

    // Process request.
    (req, res, next) => {
        const errors = validationResult(req);

        let productcategory = new ProductCategory({
            name:     req.body.name,
        });

        if (req.body.description) { productcategory.description = req.body.description }

        if (!errors.isEmpty()) {
            // Errors found.

            async.parallel({
                 productcategories: (callback) => {
                    ProductCategory.find(callback);
                }
            }, (err, results) => {
                if (err) { return next(err); }

                res.render('productcategory_form', { title: 'Create Product Category', errors: errors.array(), productcategory: productcategory, productcategories: results.productcategories });
            });
            return;
        }
        else {
            // Form data is valid. Save product category.
            productcategory.save((err) => {
                if (err) { return next(err) };
                res.redirect('/inventory/productcategory/' + productcategory._id);
            });
        }
    }
];

// Display product category details.
module.exports.productcategory_detail = (req, res, next) => {
    ProductCategory.findById(req.params.id)
    .exec((err, productcategory) => {
        if (err) { return next(err); }

        if (productcategory == null) {
            var err = new Error('Product Category not found.');
            err.status = 404;
            return next(err);
        }

        res.render('productcategory_detail', { title: 'Product Category Detail: ' + productcategory._id, productcategory: productcategory });
    });
};

// Display form for updating a product category.
module.exports.productcategory_update_get = (req, res, next) => {

        ProductCategory.findById(req.params.id, (err, productcategory) => {
            if (err) { return next(err); }
            if (productcategory == null) {
                var err = new Error('Product Gategory not found.');
                err.status = 404;
                return next(err);
            }

            res.render('productcategory_form', { title: 'Update Product Gategory: ' + productcategory._id, productcategory: productcategory });
        });

};

// Validate, sanitize and save updated product category.
// Return an array of middlewares to router.
module.exports.productcategory_update_post = [
    // Validate.
    body('name', 'Invalid value for Name.')
        .trim()
        .isLength({ min: 1, max: 100 }).withMessage('Name must be at least one character and most 100 characters long.')
        .isAlphanumeric().withMessage('Name must contain only alphanumerics.'),

     body('description', 'Invalid value for Description.')
        .trim()
        .isLength({ max: 1000 }).withMessage('Description should be at most 1000 characters long.'), // optional field: no min
    
    // Sanitize.
    sanitizeBody('*').trim().escape(),

    // Process request.
    (req, res, next) => {
        const errors = validationResult(req);

        var productcategory = new ProductCategory({
            name:               req.body.name,
            description:        (req.body.description) ? req.body.description : null,
            _id:                req.params.id
        });

        if(!errors.isEmpty()) {
            res.render('productcategory_form', { title: 'Update Product Category: ' + productcategory._id, errors: errors });    
        }
        else {
            // Update product.
            ProductCategory.findByIdAndUpdate(req.params.id, productcategory)
            .exec((err) => {
                if (err) { return next(err); }

                res.redirect(productcategory.url);
                });
            }
    }
];


// Delete product category
module.exports.productcategory_delete_post = (req, res, next) => {
    console.log(req.body);
    ProductCategory.findByIdAndDelete(req.body.id, (err) => {
        if (err) { next(err); }
        res.json({ redirect: '/inventory/productcategory'});
    });
}
