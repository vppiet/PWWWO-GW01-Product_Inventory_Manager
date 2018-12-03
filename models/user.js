var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Schema description.
var UserSchema = new Schema({
    username:      { type: String, required: true, index: { unique: true }, minlength: 4, maxlength: 100 },
    githubId:      String
});

// Export model.
module.exports = mongoose.model('User', UserSchema);