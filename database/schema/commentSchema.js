const Joi = require("joi");
const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
    body: {
        type: String,
        maxlength: 1000
    },
    commentedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },

    parentPost: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
    },

    childComments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
        default: new Array()
    }],

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

const Comment = mongoose.model("Comment", commentSchema);

function validateComment(post) {
    const schema = Joi.object({
        body: Joi.string().max(1000).required(),
    });
    return schema.validate(post);
}

exports.Comment = Comment;
exports.validateComment = validateComment;