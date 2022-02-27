const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone_number: { type: String, required: false },
    password: { type: String, required: true },
    otp: {
        code: { type: String, required: false },
        expire: { type: Date, default: null },
        is_verified: { type: Boolean, default: false }
    },
    is_deleted: { type: Boolean, default: false },
    // age: { type: String, required: true }
})

const User = mongoose.model('User', UserSchema);

module.exports = User;