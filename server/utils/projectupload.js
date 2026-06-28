const multer = require("multer")
const { CloudinaryStorage } = require("multer-storage-cloudinary")
const { cloudinary } = require("./cloudinary")

const projectstorage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "devboard-projects",  // different folder!
        allowed_formats: ["jpg", "jpeg", "png", "webp"]
    }
})

const projectupload = multer({ storage: projectstorage })

module.exports = projectupload