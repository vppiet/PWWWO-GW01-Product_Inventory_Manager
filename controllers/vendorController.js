var mongoose = require('mongoose');
var Vendor = require('../models/vendor');

// List all vendors.
module.exports.vendor_list = (req, res, next) => {

    Vendor.find({}, (err, vendors) => {
        if (err) { return next(err); }

        res.render('vendor_list', { title: 'Vendors', vendors: vendors });
    });
}

// Display form for creating a vendor.
module.exports.vendor_create_get = (req, res, next) => {
    res.render('error', { title: 'Create Vendor', message: 'Not implemented.' });
}

// Handle POST request for vendor creation.
module.exports.vendor_create_post = (req, res, next) => {
    res.render('error', { title: 'Create Vendor', message: 'Not implemented.' });
}

// Display vendor details.
module.exports.vendor_detail = (req, res, next) => {
    res.render('error', { title: 'Vendor Detail', message: 'Not implemented.' });
}

// Display vendor update form.
module.exports.vendor_update_get = (req, res, next) => {
    res.render('error', { title: 'Update Vendor', message: 'Not implemented.' });
}

// Handle POST request for vendor update.
module.exports.vendor_update_post = (req, res, next) => {
    res.render('error', { title: 'Update Vendor', message: 'Not implemented.'});
}

// Handle POST request for vendor delete.
module.exports.vendor_delete_post = (req, res, next) => {
    Vendor.findById(req.body.id, (err) => {
        if (err) { next(err); }
        res.json({ redirect: '/inventory/vendor' });
    });
}