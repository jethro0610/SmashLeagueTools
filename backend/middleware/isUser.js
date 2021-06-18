module.exports = (req, res, next) => {
    if(req.user)
        next();
    else
        res.status(400).send('You must be logged in to do this');
}