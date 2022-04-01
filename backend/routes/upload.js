import Express from "express";
import multer from "multer";
import { fileURLToPath } from "url";
import path, { dirname } from "path";
const { Storage } = require("@google-cloud/storage");

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const upload = Express.Router();

let imageUpload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname, "../uploads/"));
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    },
  }),
  fileFilter: function (req, file, callback) {
    var ext = path.extname(file.originalname);
    if (ext !== ".png" && ext !== ".jpg" && ext !== ".gif" && ext !== ".jpeg") {
      return callback(new Error("Only images are allowed"));
    }
    callback(null, true);
  },
  limits: {
    fileSize: 2621441,
  },
});

upload.route("/").post(imageUpload.single("image"), (req, res) => {
  if (req.file) {
    console.log("File downloaded at: " + req.file.path);
    //Upload to google cloud
    //Convert to base64
    //Send to PDF Conversion API
    res.send({
      status: "200",
      message: "File uploaded successfully! Processing..",
    });
  }
});

export default upload;

const storage = new Storage({ keyFilename: './google-cloud-key.json' });
const bucketname = "programmingforthecloud-340711.appspot.com/pending";
const filename = 'uploads/test.png';
const res = await storage.bucket(bucketname).upload('./' + filename);
// `mediaLink` is the URL for the raw contents of the file.
const url = res[0].metadata.mediaLink;

// Need to make the file public before you can access it.
await storage.bucket(bucketname).file(filename).makePublic();

// Make a request to the uploaded URL.
const axios = require('axios');
const pkg = await axios.get(url).then(res => res.data);
pkg.name; // 'masteringjs.io'

