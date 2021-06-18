const router = require('express').Router();
const multer = require('multer');
const isUser = require('../middleware/isUser');
const axios = require('axios');
const path = require('path');
const fs = require('fs');
const aws = require('aws-sdk');
const multerS3 = require('multer-s3');
let User = require('../models/user.model');

const endpoint = 'https://api.smash.gg/gql/alpha';
const options = {
    headers: {
        'Authorization' : 'Bearer ' + process.env.SMASHGG_KEY
    }
}

const s3 = new aws.S3({
    region: process.env.AWS_BUCKET_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY
})

const fileFilter = (req, file, cb) => {
    const allowedFileTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if(allowedFileTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(null, false);
    }
}

let upload = multer({ storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_BUCKET_NAME,
    metadata: function (req, file, cb) {
      cb(null, {fieldName: file.fieldname});
    },
    key: function (req, file, cb) {
      cb(null, req.user.id)
    }
}), fileFilter});

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

const defaultImagePath = path.join(__dirname + '/../images/default.png');
router.route('/:id/picture').get((req,res) => {
    User.findById(req.params.id)
        .then(() => {
            const params = { Bucket:process.env.AWS_BUCKET_NAME, Key: req.params.id };

            s3.getObject(params, (err, data) => {
                if(err) {
                    res.sendFile(defaultImagePath);
                    return;
                }
                var b64 = Buffer.from(data.Body, 'base64');
                res.writeHead(200, {
                    'Content-Length': b64.length,
                    "Cache-Control": "public, max-age=86400000",
                    "Expires": new Date(Date.now() + 86400000).toUTCString()
                });
                res.end(b64);
            })
        })
        .catch((err) => {
            res.status(404).send();
        })
});

router.route('/defaultprofilepicture').get((req,res) => {
    res.sendFile(profilePicPath + 'default.png');
});

module.exports = router;