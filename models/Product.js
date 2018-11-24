var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Schema description.
var ProductSchema = new Schema({
    name:               { type: String, required: true, minlength: 1, maxlength: 100 },
    description:        { type: String, minlength: 1, maxlength: 500 },
    units_in_stock:     { type: Number, required: true, min: 0 },
    price_per_unit:     { type: Number, required: true, min: 0 },
    vendor:             { type: Schema.Types.ObjectId, ref: 'Vendor', required: true },
});

// Virtual for Product's stock value: units times unit price
ProductSchema
.virtual('stock_value')
.get(() => {
    return this.units_in_stock * price_per_unit;
});

// Export model.
module.exports = mongoose.model('Product', ProductSchema);