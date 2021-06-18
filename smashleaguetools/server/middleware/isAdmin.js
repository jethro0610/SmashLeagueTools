module.exports = (req, res, next) => {
    if(!req.user) {
        res.sendStatus(400);
    }
    else if(!req.user.admin) {
        res.sendStatus(400);
    }
    else
        next();
}