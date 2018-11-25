var Product = require('../models/product');

// Display list of all products.
module.exports.overview = ((req, res, next) => {
    Product.find({}, ('name product_type in_stock'))
        .populate('product_type')
        .exec((err, products) => {
            if (err) { return (next(err)); }
            res.render('product_list', { title: 'Overview', product_list: products});
        });
});