const router = require('express').Router();
const isAdmin = require('../middleware/isAdmin');
const s3 = require('./s3').s3;
const imageFilter = require('./s3').imageFilter;
const multer = require('multer');
const multerS3 = require('multer-s3');

const uploadLogo = multer({ storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_BUCKET_NAME,
    metadata: function (req, file, cb) {
        cb(null, {fieldName: file.fieldname});
    },
    key: function (req, file, cb) {
        cb(null, 'default');
    }
}), imageFilter});

// Get the logo from S3
var logoBuffer;
const logoParams = { Bucket:process.env.AWS_BUCKET_NAME, Key: 'default' };
s3.getObject(logoParams, (err, data) => {
    logoBuffer = Buffer.from(data.Body, 'base64');
})

router.route('/logo').get((req,res) => {
    res.writeHead(200, {
        'Content-Length': logoBuffer.length,
        'Cache-Control': 'no-cache',
    });
    res.end(logoBuffer);
    return;
});

router.route('/setlogo').post(isAdmin, uploadLogo.single('logo'), (req, res) => {
    s3.getObject(logoParams, (err, data) => {
        logoBuffer = Buffer.from(data.Body, 'base64');
        res.sendStatus(200);
    })
});

module.exports = router;