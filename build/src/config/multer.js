"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const multer = require('multer');
const path = require('path');
const multerS3 = require('multer-s3');
const aws = require('aws-sdk');
const chalk_1 = require("chalk");
const crypto = require("crypto");
require('dotenv').config();
const storageS3 = new aws.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});
const storageTypes = {
    local: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, path.resolve(__dirname, '..', 'tmp', 'uploads'));
        },
        filename: (req, file, cb) => {
            // garantir que os nomes não se sobreponham
            // usa-se um hash 
            crypto.randomBytes(16, (err, hash) => {
                if (err)
                    chalk_1.cyanBright(err);
                file.key = `${hash.toString('hex')}-${file.originalname}`;
                cb(null, file.key);
            });
        }
    }),
    s3: multerS3({
        s3: new aws.S3(),
        bucket: 'endoh',
        contentType: multerS3.AUTO_CONTENT_TYPE,
        acl: 'public-read',
        key: (req, file, cb) => {
            // garantir que os nomes não se sobreponham
            // usa-se um hash 
            crypto.randomBytes(16, (err, hash) => {
                if (err)
                    chalk_1.cyanBright(err);
                const fileName = `${hash.toString('hex')}-${file.originalname}`;
                cb(null, fileName);
            });
        }
    })
};
module.exports = {
    dest: path.resolve(__dirname, '..', 'tmp', 'uploads'),
    storage: storageTypes['s3'],
    limits: {
        fileSize: 2 * 1024 * 1024
    },
    fileFilter: (req, file, cb) => {
        const allowedMimes = [
            'image/jpeg',
            'image/pjpeg',
            'image/png',
            'image/gif',
        ];
        if (allowedMimes.includes(file.mimetype)) {
            cb(null, true);
        }
        else {
            cb(new Error("Invalid file type."));
        }
    }
};
//# sourceMappingURL=multer.js.map