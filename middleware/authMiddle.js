function authenticate(req, res, next) {
    if (req.session && req.session.user)
        next();
    else
        return res.redirect("/users/login");
}

module.exports = authenticate;