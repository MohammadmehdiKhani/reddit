const Joi = require("joi");
const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 100
    },
    body: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 1000
    },
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    community: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Community",
        required: true,
    },
    likedBies: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: new Array()
    }],
    dislikedBies: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: new Array()
    }]
}, { timestamps: true });

const Post = mongoose.model("Post", postSchema);

function validatePost(post) {
    const schema = Joi.object({
        title: Joi.string().min(5).max(100).required(),
        body: Joi.string().min(5).max(1000).required(),
        postedBy: Joi.string().required(),
        community: Joi.string().required()
    });
    return schema.validate(post);
}

exports.Post = Post;
exports.validatePost = validatePost;