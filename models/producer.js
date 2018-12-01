var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Schema description.
var ProducerSchema = new Schema({
    company_name:       { type: String, required: true, minlength: 1, maxlength: 100 },
    description:        { type: String, minlength: 1, maxlength: 1000 },
    contact_person:     { type: String, minlength: 0, maxlength: 100 },
    email:              { type: String, required: true, minlength: 1, maxlength: 100 },
    phone:              { type: String, required: true, minlength: 10, maxlength: 20 }
});

// Virtual for producer's URL.
ProducerSchema
.virtual('url')
.get(function () {
    return '/inventory/producer/' + this._id;
});

// Export model.
module.exports = mongoose.model('Producer', ProducerSchema);