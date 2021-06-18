module.exports = (req, res, next) => {
    if(!req.user) {
        console.log('Not user')
        res.sendStatus(400);
    }
    else if(!req.user.admin) {
        console.log('Not admin')
        res.sendStatus(400);
    }
    else
        next();
}