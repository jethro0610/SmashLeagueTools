const router = require('express').Router();
const isUser = require('../middleware/isUser');
let User = require('../models/user.model');

router.route('/').get(isUser, (req,res) => {
    User.find()
        .then(users => res.json(users))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/add').post((req, res) => {
    const username = req.body.username;
    const newUser = new User({username});

    newUser.save()
        .then(() => res.json('User added'))
        .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;