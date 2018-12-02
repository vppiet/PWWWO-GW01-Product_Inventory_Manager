var Producer = require('../models/producer');

var async = require('async');

const { body, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');


// Overview: Display counts of collections.
module.exports.overview = (req, res, next) => {

    async.parallel({
        producer_count: (callback) => {
            Producer.countDocuments(callback);
        }
    }, (err, results) => {
        if (err) { return next(err); }

        res.render('overview', { title: 'Overview', data: results });
    });

};

// List all producers.
module.exports.producer_list = (req, res, next) => {

    Producer.find({})
    .populate('producer')
    .exec((err, results) => {
        if (err) { return next(err); }

        res.render('producer_list', { title: 'Producers', producers: results });
    });

};

// Display form for creating a producer.
module.exports.producer_create_get = (req, res, next) => {

    async.parallel({
        producers: (callback) => {
            Producer.find(callback)
        }
    }, (err, results) => {
        if (err) { return next(err); }

        res.render('producer_form', { title: 'Create Producer', producers: results.producers });
    });

};

// Validate, sanitize and save submitted producer.
// Return an array of middleware to router.
module.exports.producer_create_post = [
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
        console.log(errors); // DEBUG

        let producer = new Producer({
            company_name: req.body.company_name,
            contact_person: req.body.contact_person,
            email: req.body.email,
            phone: req.body.phone,
        });

        if (req.body.description) { product.description = req.body.description }

        if (!errors.isEmpty()) {
            // Errors found.

            async.parallel({
                producers: (callback) => {
                    Producer.find(callback);
                }
            }, (err, results) => {
                if (err) { return next(err); }

                res.render('producer_form', { title: 'Create Producer', errors: errors.array(), producer: producer, producers: results.producers });
            });
            return;
        }
        else {
            // Form data is valid. Save producer.
            producer.save((err) => {
                if (err) { return next(err) };
                res.redirect('/inventory/producers/' + producer._id);
            });
        }
    }
];

// Display producer details.
module.exports.producer_detail = (req, res, next) => {
    Producer.findById(req.params.id)
    .exec((err, producer) => {
        if (err) { return next(err); }

        if (producer == null) {
            var err = new Error('Producer not found.');
            err.status = 404;
            return next(err);
        }

        res.render('producer_detail', { title: 'Producer Detail: ' + producer._id, producer: producer });
    });
};

// Display form for updating a producer.
module.exports.producer_update_get = (req, res, next) => {

    async.parallel({
        producer: (callback) => {
            Producer.findById(req.params.id)
            .populate('company_name')
            .populate('contact_person')
            .populate('email')
            .populate('phone')
            .exec(callback)
        },
        producers: (callback) => {
            Producer.find(callback);
        }
    }, (err, results) => {
        if (err) { return next(err); }

        if (results.producer == null) {
            var err = new Error('Producer not found.');
            err.status = 404;
            return next(err);
        }

        res.render('producer_form', { title: 'Update Producer: ' + results.producer._id, producer: results.producer, producers: results.producers });
    });
};

// Delete producer
module.exports.producer_delete_post = (req, res, next) => {
    console.log(req.body);
    Producer.findByIdAndDelete(req.body.id, (err) => {
        if (err) { next(err); }
        res.json({ redirect: '/inventory/producer'});
    });
}