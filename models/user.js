const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    email: { type: String, required: true, unique: true, validate: [validator.isEmail, 'Email inválido'] },
    password: { type: String, required: true, minlength: 6 },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;