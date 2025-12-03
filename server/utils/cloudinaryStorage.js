const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("./cloudinary");

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "track2crack/avatars", // Match the folder path used in controller
    allowed_formats: ["jpg", "png", "jpeg"],
    transformation: [{ width: 300, height: 300, crop: "fill" }],
    public_id: (req, file) => {
      // Generate unique filename to prevent conflicts
      return `avatar_${req.params.userId}_${Date.now()}`;
    }
  },
});

module.exports = storage;
