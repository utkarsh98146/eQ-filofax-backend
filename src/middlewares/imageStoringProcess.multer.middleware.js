import { error } from "console"
import multer from "multer"
import path from "path"
import fs from "fs"

const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    const uploadPath = path.join(process.cwd(), "uploads")
    // Ensure the directory exists
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true })
    }
    callback(null, uploadPath)
  },
  filename: function (req, file, callback) {
    return callback(null, `${Date.now()}-${file.originalname}`)
  },
})

const uploadFileValidation = (req, file, cb) => {
  const allowOnly = ["image/jpeg", "image/png", "image/jpg"]

  if (allowOnly.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error("Only JPEG, PNG, JPG type files allowed"), false)
  }
}

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // Limited to 5mb only
  },
  fileFilter: uploadFileValidation,
})

export const uploadImage = (fieldName) => (req, res, next) => {
  const uploadSingle = upload.single(fieldName)

  uploadSingle(req, res, (error) => {
    if (error) {
      console.log("Error while saving the image in middleware", error)
      return res.status(400).json({
        message: "Error while saving the image in middleware ",
        error: error.message,
      })
    }
    console.log(`Image saved successfully`)
    next()
  })
}
