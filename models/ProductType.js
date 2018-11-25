var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Schema description.
var ProductTypeSchema = new Schema({
    name:       { type: String, required: true, minlength: 1, maxlength: 100 },
    category:   { type: String, required: true, minlength: 1, maxlength: 100 }
});

// Export model.
module.exports = mongoose.model('ProductType', ProductTypeSchema);