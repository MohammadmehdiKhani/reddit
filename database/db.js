const mongoose = require("mongoose");
const config = require("config");
const bcrypt = require("bcrypt");
const { User } = require("./schema/userSchema");

function connectToDb() {
    var dbUrl = config.get("DB_URL");
    mongoose.connect(dbUrl)
        .then(async () => {
            console.log("connect to db successfully");
        })
        .catch(() => console.log("failed to connect to db"));
}

module.exports = connectToDb;