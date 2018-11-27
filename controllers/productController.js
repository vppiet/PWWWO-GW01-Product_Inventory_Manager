var Product = require('../models/product');
var ProductCategory = require('../models/productcategory');
var Producer = require('../models/producer');
var Vendor = require('../models/vendor');
var async = require('async');

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

// List products.
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

// Create product.
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

// Display update form.
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