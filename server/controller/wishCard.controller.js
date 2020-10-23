const multer = require('multer');
const AWS = require('aws-sdk');
const multerS3 = require('multer-s3');
const { v4: uuidv4 } = require('uuid');
const sharp = require('sharp');
const path = require('path');
const { log } = require('../helper/logger');

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

// --------------- start s3 upload middleware  ---------------

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_KEY,
  secretAccessKey: process.env.AWS_SECRET,
});

const storage = multer.diskStorage({
  destination: `${path.join(__dirname, 'uploads/')}`,
  filename: (req, file, cb) => {
    cb(null, file.filename);
  },
});

const s3storage = multerS3({
  s3,
  bucket: process.env.S3BUCKET,
  acl: 'public-read',
  key(req, file, cb) {
    cb(null, uuidv4());
  },
});

function upload(req, file) {
  const fileStorage = process.env.USE_AWS ? s3storage : storage;

  fileStorage._handleFile(req, file, (error) => {
    if (error) {
      log.error(error);
    }
  });
}

// --------------- end s3 upload middleware  ---------------

// --------------- start memory upload middleware  ---------------

const multerStorage = multer.memoryStorage();

const loadInMemory = multer({
  storage: multerStorage,
  limits: {
    fileSize: 1024 * 1024 * 5, // up to 5 mbs
  },
  fileFilter,
});

// --------------- end memory upload middleware  ---------------

// --------------- start resizing middleware  ---------------

const resizeImage = async (req, res, next) => {
  if (!req.file) {
    return next();
  }

  const fileName = req.file.originalname.replace(/\..+$/, '');
  const newFileName = `${new Date().toISOString()}-${fileName}.jpeg`;

  const imageBuffer = await sharp(req.file.buffer)
    .resize(650, 240)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toBuffer();

  req.file.originalname = newFileName;
  req.file.filename = newFileName;
  req.file.buffer = Buffer.from(imageBuffer);

  await Promise.resolve(upload(req, req.file));

  return next();
};

// --------------- end resizing middleware  ---------------

module.exports = { resizeImage, loadInMemory };
