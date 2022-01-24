const express = require("express");
const session = require("express-session");
const config = require("config");
const debug = require("debug")("app:debug");
const bodyPrser = require("body-parser");
const db = require("./database/db");

const postApi = require("./route/api/postApi");
const communityApi = require("./route/api/communityApi");
const homeRoutes = require("./route/homeRounts");
const userRoutes = require("./route/usersRoutes");
const postRoutes = require("./route/postRoutes");
const communityRoutes = require("./route/communityRoutes");
const { json } = require("express/lib/response");

const app = express();
debug(app.get("env"));
const port = config.get("PORT");

app.use(express.static("public"));
app.use(express.static("node_modules"));
app.use(express.json());
app.use(bodyPrser.urlencoded({ extended: false }));
app.use(session({
    secret: "SESSION_SECRECT",
    resave: true,
    saveUninitialized: false
}));
app.use(function (req, res, next) {
    res.locals.session = req.session.user;
    next();
});

app.set("view engine", "pug");
app.set("views", "views");

app.use("/api/posts", postApi);
app.use("/api/communities", communityApi);
app.use("/", homeRoutes);
app.use("/users", userRoutes)
app.use("/posts", postRoutes)
app.use("/communities", communityRoutes)

db();
const server = app.listen(port, () => console.log(`Start server on port ${port}`));