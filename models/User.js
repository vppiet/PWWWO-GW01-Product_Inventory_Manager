var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Schema description.
var UserSchema = new Schema({
    username:      { type: String, required: true, index: { unique: true }},
    hash:          { type: String, required: true }
});

// Export model.
module.exports = mongoose.model('User', UserSchema);