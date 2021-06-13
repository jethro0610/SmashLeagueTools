const router = require('express').Router();
const isUser = require('../middleware/isUser');
let User = require('../models/user.model');

router.route('/get').get(isUser, (req,res) => {
    res.send({
        name: req.user.name,
        balance: req.user.balance,
        admin: req.user.admin
    });
});


module.exports = router;