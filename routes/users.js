const router = require('express').Router();
const isUser = require('../middleware/isUser');
const axios = require('axios');
const s3 = require('./s3').s3;
const imageFilter = require('./s3').imageFilter;
const multer = require('multer');
const multerS3 = require('multer-s3');
let User = require('../models/user.model');

const endpoint = 'https://api.smash.gg/gql/alpha';
const options = {
    headers: {
        'Authorization' : 'Bearer ' + process.env.SMASHGG_KEY
    }
}

const uploadProfilePic = multer({ storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_BUCKET_NAME,
    metadata: function (req, file, cb) {
        cb(null, {fieldName: file.fieldname});
    },
    key: function (req, file, cb) {
        cb(null, req.user.id)
    }
}), imageFilter});

router.route('/get').get(isUser, (req,res) => {
    // Remove the 'user/' section of the smash.gg slug
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

router.route('/updateprofile').post(isUser, uploadProfilePic.single('profile-pic'), (req, res) => {
    if (req.body.ggSlug) { // Ensure a smash.gg slug was sent
        req.body.ggSlug = 'user/' + req.body.ggSlug;

        // Ignore already set smash.gg slugs
        if(req.body.ggSlug === req.user.ggSlug) {
            res.status(400).send('Already have that SmashGG ID');
            return;
        }

        // Query for the user on smash.gg
        const query = `{
            user(slug: "${req.body.ggSlug}") {
                player {
                    gamerTag
                }
            }
        }`

        // Get the user from smash.gg
        axios.post(endpoint, {query}, options).then(ggRes => {
            // Ignore invalid users
            if (!ggRes.data.data.user) {
                res.status(400).send('Invalid SmashGG ID');
                return;
            }

            const updateData = {
                name: ggRes.data.data.user.player.gamerTag,
                ggSlug: req.body.ggSlug
            }

            // Update the MongoDB users smash.gg slug and name
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


router.route('/:id/picture').get((req,res) => {
    User.findById(req.params.id) // Ensure the user is valid
        .then(() => {
            const params = { Bucket:process.env.AWS_BUCKET_NAME, Key: req.params.id };

            // Get the image from AWS S3
            s3.getObject(params, (err, data) => {
                // Return the default image if the user has no profile picture
                if(err) {
                    res.redirect('/images/logo')
                    return;
                }

                // Send back the image from S3 as a viewable image
                var b64 = Buffer.from(data.Body, 'base64');
                res.writeHead(200, {
                    'Content-Length': b64.length,
                    'Cache-Control': 'no-cache'
                });
                res.end(b64);
            })
        })
        .catch((err) => {
            res.status(404).send();
        })
});

module.exports = router;