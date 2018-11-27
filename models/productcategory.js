var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Schema description.
var ProductTypeSchema = new Schema({
    name:           { type: String, required: true, minlength: 1, maxlength: 100 },
    description:    { type: String, minlength: 1, maxlength: 1000 }
});

// Export model.
module.exports = mongoose.model('ProductCategory', ProductTypeSchema);