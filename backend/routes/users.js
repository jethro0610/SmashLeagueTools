const router = require('express').Router();
const multer = require('multer');
const isUser = require('../middleware/isUser');
const axios = require('axios');
const path = require('path');
const fs = require('fs');
let User = require('../models/user.model');

const endpoint = 'https://api.smash.gg/gql/alpha';
const options = {
    headers: {
        'Authorization' : 'Bearer ' + process.env.SMASHGG_KEY
    }
}

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './profiles');
    },
    filename: function(req, file, cb) {
        cb(null, req.user.id + '.png');
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
    var formattedGGSlug = undefined;
    if (req.user.ggSlug)
        formattedGGSlug = req.user.ggSlug.substring(5);
    res.send({
        id: req.user.id,
        name: req.user.name,
        ggSlug: formattedGGSlug,
        balance: req.user.balance,
        admin: req.user.admin
    });
});

router.route('/updateprofile').post(isUser, upload.single('profile-pic'), (req, res) => {
    if (req.body.ggSlug) {
        req.body.ggSlug = 'user/' + req.body.ggSlug;
        if(req.body.ggSlug === req.user.ggSlug) {
            res.status(400).send('Already have that SmashGG ID');
            return;
        }

        const query = `{
            user(slug: "${req.body.ggSlug}") {
                player {
                    gamerTag
                }
            }
        }`

        axios.post(endpoint, {query}, options).then(ggRes => {
            if (!ggRes.data.data.user) {
                res.status(400).send('Invalid SmashGG ID');
                return;
            }

            const updateData = {
                name: ggRes.data.data.user.player.gamerTag,
                ggSlug: req.body.ggSlug
            }

            User.findByIdAndUpdate(req.user.id, updateData, {new: true}, (err, user) => {
                res.send('Succesfully updated');
            });
        })
        .catch(error => {
            console.log(error);
        })
    }
    else {
        res.send('Succesfully updated');
    }
});

const profilePicPath = path.join(__dirname + '/../profiles/');
router.route('/:id/picture').get((req,res) => {
    User.findById(req.params.id)
        .then(() => {
            const picPath = profilePicPath + req.params.id + '.png';
            if (fs.existsSync(picPath)) {
                res.sendFile(picPath);
            }
            else {
                res.sendFile(profilePicPath + 'default.png');
            }
        })
        .catch((err) => {
            res.status(404).send();
        })
});

router.route('/defaultprofilepicture').get((req,res) => {
    res.sendFile(profilePicPath + 'default.png');
});

module.exports = router;