import Express from "express";
import multer from "multer";
import { fileURLToPath } from "url";
import path, { dirname } from "path";
import * as Storage from "@google-cloud/storage";
import FileReader from 'robot.utils';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const upload = Express.Router();
const base64String = "";

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

upload.route("/").post(imageUpload.single("image"),async function (req, res){
  if (req.file) {
    console.log("File downloaded at: " + req.file.path);

    //Upload to google cloud

    const storage = new Storage.Storage({ projectId: "programmingforthecloud-340711", keyFilename: "./key.json",});
    const bucketname = "programmingforthecloud-340711.appspot.com";

    await storage.bucket(bucketname).upload(req.file.path, {
    destination: "pending/" + req.file.originalname,
  });

    //Convert to base64
    var file = req.file;

  var reader = new FileReader();
  console.log("next");
    
  reader.onload = function () {
      base64String = reader.result.replace("data:", "")
          .replace(/^.+,/, "");

      imageBase64Stringsep = base64String;

      // alert(imageBase64Stringsep);
      console.log(base64String);
  }
  reader.readAsDataURL(file);

  console.log("Base64String about to be printed");
  alert(base64String);

    //Send to PDF Conversion API
    res.send({
      status: "200",
      message: "File uploaded successfully! Processing..",
    });
  }
});




export default upload;

