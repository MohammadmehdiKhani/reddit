const express = require("express");
const config = require("config");
const debug = require("debug")("app:debug");
const bodyPrser = require("body-parser");
const db = require("./database/db");

const postRoutes = require("./route/postRoutes");
const userRoutes = require("./route/homeRounts");

const app = express();
debug(app.get("env"));
const port = config.get("PORT");

app.use(express.json())
app.use(bodyPrser.urlencoded({ extended: false }));

app.set("view engine", "pug");
app.set("views", "views");

app.use("/postRoutes", postRoutes);
app.use("/home", userRoutes);

db();
const server = app.listen(port, () => console.log(`Start server on port ${port}`));