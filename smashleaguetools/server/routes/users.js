const router = require('express').Router();
const multer = require('multer');
const isUser = require('../middleware/isUser');
let User = require('../models/user.model');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './profiles');
    },
    filename: function(req, file, cb) {
        cb(null, 'testFile.png');
    }
})

const fileFilter = (req, file, cb) => {
    const allowedFileTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if(allowedFileTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(null, false);
    }
}

let upload = multer({ storage, fileFilter});

router.route('/get').get(isUser, (req,res) => {
    res.send({
        name: req.user.name,
        balance: req.user.balance,
        admin: req.user.admin
    });
});

router.route('/uploadProfile').post(isUser, upload.single('profile'), (req, res) => {
    if (!req.file) {
        throw Error("FILE_MISSING");
    } else {
        res.send("success");
    }
});

module.exports = router;