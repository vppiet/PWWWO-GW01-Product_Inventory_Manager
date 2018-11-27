var mongoose = require('mongoose');
var async = require('async');

process.env["NODE_CONFIG_DIR"] = __dirname + '/../config/';
var config = require('config');

var Product = require('../models/product');
var ProductCategory = require('../models/productcategory');
var Vendor = require('../models/vendor');
var Producer = require('../models/producer');

// Set up MongoDB connection
let connectionString = config.get('database.connectionstring');
mongoose.connect(connectionString, (err) => {
    if (err) { return console.log('Error while connecting to MongoDB.'); }
    console.log('Connected to MongoDB.');
});
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error'));

// SAVE NEW CATEGORY
// let category = new ProductCategory({
//     name: 'beverage',
//     description: 'Refreshing drinks'
// });
// category.save((err) => {
//     if (err) { console.log('Error:', err); }
//     else { console.log('Successful.'); }
//     db.close();
// });

// SAVE NEW VENDOR
//let vendor = new Vendor({
//    company_name:   'Hartwall',
//    contact_person: 'Matti Meikäläinen',
//    email: 'vendor@hartwall.fi',
//    phone:  '08001-58663'
//});
//vendor.save((err) => {
//    if (err) { console.log('Error:', err); }
//    else { console.log('Successful.'); }
//    db.close();
//});

// SAVE NEW PRODUCER
//let producer = new Producer({
//    company_name:   'Hartwall',
//    contact_person: 'Maija Mehiläinen',
//    email:  'producer@hartwall.fi',
//    phone:  '08001-58662'
//});
//producer.save((err) => {
//    if (err) { console.log('Error:', err); }
//    else { console.log('Successful.'); }
//    db.close();
//});

// SAVE NEW PRODUCT
let productDetails = {
    name:   'Jaffa',
    category: 'beverage',
    description: 'Jaffa is a popular carbonated soft drink produced in Finland by Hartwall. Jaffa is usually orange flavoured, however different flavours are sold.',
    in_stock: 105,
    units_in_package: 24,
    vendor: 'Hartwall',
    producer:   'Hartwall'
};

async.parallel({
    category: (callback) => {
        ProductCategory.findOne({name: productDetails.category}, '_id')
        .exec(callback);
    },
    vendor: (callback) => {
        Vendor.findOne({ company_name: productDetails.vendor }, '_id')
        .exec(callback);
    },
    producer: (callback) => {
        Producer.findOne({ company_name: productDetails.producer}, '_id')
        .exec(callback);
    }
}, (err, results) => {
    if (err) {
        db.close();
        return console.log('Error:', err);
    }
    let product = new Product({
        name:               productDetails.name,
        category:           results.category._id,
        description:        productDetails.description,
        in_stock:           productDetails.in_stock,
        units_in_package:   productDetails.units_in_package,
        vendor:             results.vendor._id,
        producer:           results.producer._id
    });
    product.save((err) => {
        if (err) {
            db.close();
            return console.log('Error:', err);
        }
        console.log('Successful.');
        db.close();
    });
});