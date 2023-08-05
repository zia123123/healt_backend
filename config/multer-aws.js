const multer = require('multer');
const aws = require('aws-sdk');
const multerS3 = require('multer-s3');
require('dotenv').config()


aws.config.update({
  secretAccessKey: process.env.CREDENTIAL_SECRET_S3,
  accessKeyId: process.env.ACCESS_KEY_S3,
});

const s3 = new aws.S3();

const storage = multerS3({
  s3: s3,
  bucket: process.env.BUCKET,
  key: function (req, file, cb) {
        const ext = file.mimetype.split('/')[1]
        cb(null, file.fieldname+ '-' +Date.now()+ '.' +ext);
      }
});

const upload = multer({ storage: storage });
module.exports = upload;