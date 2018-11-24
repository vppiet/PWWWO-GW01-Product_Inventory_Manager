var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Schema description.
var VendorSchema = new Schema({
    name:   { type: String, required: true, minlength: 1, maxlength: 100 },
    email:  { type: String, required: true, minlength: 1, maxlength: 100 },
    phone:  { type: String, required: true, minlength: 10, maxlength: 20 }
});

// Export model.
module.exports = mongoose.model('Vendor', VendorSchema);