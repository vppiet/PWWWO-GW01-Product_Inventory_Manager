var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Schema description.
var UserSchema = new Schema({
    username:      { type: String, required: true, index: { unique: true }, minlength: 4, maxlength: 100 },
    password:      { type: String, required: true, minlength: 10, maxlength: 100 }
});

// Prehook for hashing passwords before saving.
UserSchema.pre('save', (next) => {
    // do hashing here
});

// Static method for authenticating user.
UserSchema.static('authenticate', (username, password) => {
    // authenticate here
});

// Export model.
module.exports = mongoose.model('User', UserSchema);