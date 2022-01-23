const Joi = require("joi");
const mongoose = require("mongoose");

const communitySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 100
    },
    description: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 1000
    },
    memberIds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: new Array()
    }],
    adminIds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: new Array()
    }],
    postIds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
        default: new Array()
    }]
}, { timestamps: true });

const Community = mongoose.model("Community", communitySchema);

function validateCommunity(community) {
    const schema = Joi.object({
        name: Joi.string().min(5).max(100),
        description: Joi.string().min(5).max(1000)
    });
    return schema.validate(community);
}

exports.Community = Community;
exports.validateCommunity = validateCommunity;