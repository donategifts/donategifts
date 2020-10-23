const multer = require('multer');
const AWS = require('aws-sdk');
const multerS3 = require('multer-sharp-s3');
const { v4: UUIDv4 } = require('uuid');
const path = require('path');

// -------------- multer setup --------------
const fileFilter = (req, file, cb) => {
  // reject a file
  if (
    file.mimetype === 'image/jpeg' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/gif' ||
    file.mimetype === 'image/png'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_KEY,
  secretAccessKey: process.env.AWS_SECRET,
});

let storage;

if (process.env.USER_AWS !== 'true') {
  storage = multer.diskStorage({
    destination: `${path.join(__dirname, '../../uploads/')}`,
    filename: (req, file, cb) => {
      cb(null, `${UUIDv4()}-${file.filename || file.originalname}.jpeg`);
    },
  });
} else {
  storage = multerS3({
    s3,
    bucket: process.env.S3BUCKET,
    acl: 'public-read',
    key(req, file, cb) {
      // rename the file since we convert it to jpeg
      cb(null, `${UUIDv4()}-${file.filename}.jpeg`);
    },
    // can use any of the sharp options here
    resize: {
      height: 640,
    },
    // convert all files to jpeg
    toFormat: 'jpeg',
  });
}
// -------------- multer setup end --------------

const upload = multer({
  storage,
  limits: {
    fileSize: 1024 * 1024 * 5, // up to 5 mbs
  },
  fileFilter,
});

module.exports = { upload };
