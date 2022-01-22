const Joi = require("joi");
const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 100
    },
    body: {
        type: String,
        minlength: 3,
        maxlength: 100
    },
    likedBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: new Array()
    }]
}, { timestamps: true });

const Post = mongoose.model("Post", postSchema);

function validatePost(post) {
    const schema = Joi.object({
        title: Joi.string().alphanum().min(3).max(100),
        body: Joi.string().alphanum().min(3).max(100),
    });
    return schema.validate(post);
}

exports.Post = Post;
exports.validatePost = validatePost;