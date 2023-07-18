import { S3Client } from "@aws-sdk/client-s3"
import crypto from "crypto"
import multer from "multer"
import multerS3 from "multer-s3"
import path from "path"

require("dotenv").config()

const storageTypes = {
  local: multer.diskStorage({
    destination: (_req, _file, cb) => {
      cb(null, path.resolve(__dirname, "..", "tmp", "uploads"))
    },
    filename: (_req, file, cb) => {
      // garantir que os nomes não se sobreponham
      // usa-se um hash
      crypto.randomBytes(16, (err, hash) => {
        if (err) console.error(err)

        const key = `${hash.toString("hex")}-${file.originalname}`
        cb(null, key)
      })
    },
  }),
  s3: multerS3({
    s3: new S3Client({}),

    bucket: "endoh",
    contentType: multerS3.AUTO_CONTENT_TYPE,
    acl: "public-read", // permissão
    key: (_req, file, cb) => {
      // garantir que os nomes não se sobreponham
      // usa-se um hash
      crypto.randomBytes(16, (err, hash) => {
        if (err) console.error(err)

        const fileName = `${hash.toString("hex")}-${file.originalname}`

        cb(null, fileName)
      })
    },
  }),
}

export const multerConfig = {
  dest: path.resolve(__dirname, "..", "tmp", "uploads"),
  storage: storageTypes["s3"],
  limits: {
    fileSize: 2 * 1024 * 1024,
  },
  fileFilter: (_req: any, file: any, cb: any) => {
    const allowedMimes = ["image/jpeg", "image/pjpeg", "image/png", "image/gif"]

    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true)
      return
    }
    cb(new Error("Invalid file type."))
  },
}
