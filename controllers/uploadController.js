const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 }, // 1MB limit
  fileFilter: (req, file, cb) => {
    checkFileType(file, cb);
  },
}).single("image");

function checkFileType(file, cb) {
  const filetypes = /jpeg|jpg|png|gif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb("plaese select this type of images jpeg, jpg, png, gif ");
  }
}

const uploadImage = (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      res.status(400).json({ success: false, message: err });
    } else {
      if (req.file == undefined) {
        res.status(400).json({ success: false, message: "No file selected!" });
      } else {
        res.status(200).json({
          success: true,
          message: "File uploaded successfull !!",
          file: `uploads/${req.file.filename}`,
        });
      }
    }
  });
};

module.exports = {
  uploadImage,
};
