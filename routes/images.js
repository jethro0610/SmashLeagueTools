const router = require('express').Router();
const isAdmin = require('../middleware/isAdmin');
const s3 = require('./s3')

// Get the logo from S3
var logoBuffer;
const logoParams = { Bucket:process.env.AWS_BUCKET_NAME, Key: 'default' };
s3.getObject(logoParams, (err, data) => {
    logoBuffer = Buffer.from(data.Body, 'base64');
})

router.route('/logo').get((req,res) => {
    res.writeHead(200, {
        'Content-Length': logoBuffer.length,
        "Cache-Control": "public, max-age=86400000",
        "Expires": new Date(Date.now() + 86400000).toUTCString()
    });
    res.end(logoBuffer);
    return;
});

router.route('/reloadlogo').get(isAdmin, (req,res) => {
    s3.getObject(logoParams, (err, data) => {
        logoBuffer = Buffer.from(data.Body, 'base64');
        res.sendStatus(200);
    })
});

module.exports = router;