var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Schema description.
var ProductCategorySchema = new Schema({
    name:           { type: String, required: true, minlength: 1, maxlength: 100 },
    description:    { type: String, minlength: 1, maxlength: 1000 }
});

// Virtual for product category URL.
ProductCategorySchema
.virtual('url')
.get(function () {
    return '/inventory/productcategory/' + this._id;
});

// Export model.
module.exports = mongoose.model('ProductCategory', ProductCategorySchema);