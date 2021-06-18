module.exports = (req, res, next) => {
    if(!req.user)
        res.sendStatus(400);
    else if(!req.admin)
        res.sendStatus(400);
    else
        next();
}