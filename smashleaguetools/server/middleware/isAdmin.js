module.exports = (req, res, next) => {
    if(!req.user) {
        res.status(400).send('You must be an admin to do this');
    }
    else if(!req.user.admin) {
        res.status(400).send('You must be an admin to do this');
    }
    else
        next();
}