"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var multer = require('multer');
var path = require('path');
var multerS3 = require('multer-s3');
var aws = require('aws-sdk');
var chalk_1 = require("chalk");
var crypto = require("crypto");
require('dotenv').config();
var storageS3 = new aws.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});
var storageTypes = {
    local: multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, path.resolve(__dirname, '..', 'tmp', 'uploads'));
        },
        filename: function (req, file, cb) {
            // garantir que os nomes não se sobreponham
            // usa-se um hash 
            crypto.randomBytes(16, function (err, hash) {
                if (err)
                    chalk_1.cyanBright(err);
                file.key = hash.toString('hex') + "-" + file.originalname;
                cb(null, file.key);
            });
        }
    }),
    s3: multerS3({
        s3: new aws.S3(),
        bucket: 'endoh',
        contentType: multerS3.AUTO_CONTENT_TYPE,
        acl: 'public-read',
        key: function (req, file, cb) {
            // garantir que os nomes não se sobreponham
            // usa-se um hash 
            crypto.randomBytes(16, function (err, hash) {
                if (err)
                    chalk_1.cyanBright(err);
                var fileName = hash.toString('hex') + "-" + file.originalname;
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
    fileFilter: function (req, file, cb) {
        var allowedMimes = [
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