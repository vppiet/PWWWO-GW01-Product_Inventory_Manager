var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Schema description.
var ProductSchema = new Schema({
    name:               { type: String, required: true, minlength: 1, maxlength: 100 },
    category:           { type: Schema.Types.ObjectId, ref: 'ProductCategory', required: true },
    description:        { type: String, minlength: 1, maxlength: 1000 },
    in_stock:           { type: Number, required: true, min: 0 },
    stock_last_updated: { type: Date, default: null },
    units_in_package:   { type: Number, required: true, min: 1 },
    vendor:             { type: Schema.Types.ObjectId, ref: 'Vendor', required: true },
    producer:           { type: Schema.Types.ObjectId, ref: 'Producer', required: true },
});

// Virtual for product's URL.
ProductSchema
.virtual('url')
.get(function () {
    return '/inventory/product/' + this._id;
});

// Export model.
module.exports = mongoose.model('Product', ProductSchema);