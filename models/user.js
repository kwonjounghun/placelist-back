const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const crypto = require('crypto')
const config = require('../config')

const User = new Schema({
    username: String,
    userEmail: String,
    password: String,
    admin: {
        type: Boolean,
        default: false
    },
    social: {
        type: String,
        default: null
    },
    createDate : { type: Date, default: Date.now }
});

User.statics.create = function(username, userEmail, password, social){
    const encrypted = crypto.createHmac('sha1', config.secret)
    .update(password)
    .digest('base64');

    const user = new this({
        username,
        userEmail,
        password : encrypted
    });

    return user.save();
}

User.statics.findOneByUsername = function(userEmail) {
    return this.findOne({
        userEmail
    }).exec();
};

User.methods.verify = function(password) {
    const encrypted = crypto.createHmac('sha1', config.secret)
    .update(password)
    .digest('base64');

    return this.password === encrypted
};

User.methods.assignAdmin = function() {
    this.admin = true
    return this.save();
};

module.exports = mongoose.model('User', User);