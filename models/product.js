var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Schema description.
var ProductSchema = new Schema({
    name:               { type: String, required: true, minlength: 1, maxlength: 100 },
    type:               { type: Schema.Types.ObjectId, ref: 'ProductType', required: true },
    description:        { type: String, minlength: 1, maxlength: 500 },
    in_stock:           { type: Number, required: true, min: 0 },
    vendor:             { type: Schema.Types.ObjectId, ref: 'Vendor', required: true },
    producer:           { type: Schema.Types.ObjectId, ref: 'Producer', required: true }
});

// Export model.
module.exports = mongoose.model('Product', ProductSchema);