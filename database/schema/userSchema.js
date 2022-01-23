const Joi = require("joi");
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 100
    },
    password: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 100
    },
    email: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 100
    },
    memberOfIds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Community",
        default: new Array()
    }],
    adminOfIds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Community",
        default: new Array()
    }],
    likedPosts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
        default: new Array()
    }],
    dislikedPosts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
        default: new Array()
    }]

}, { timestamps: true });

const User = mongoose.model("User", userSchema);

function validateUser(user) {
    const schema = Joi.object({
        username: Joi.string().min(5).max(100).required(),
        password: Joi.string().min(5).max(100).required(),
        email: Joi.string().min(5).max(100).required()
    });
    return schema.validate(user);
}

exports.User = User;
exports.validateUser = validateUser;