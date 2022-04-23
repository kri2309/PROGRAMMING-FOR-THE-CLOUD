import Express from "express";
import multer from "multer";
import { fileURLToPath } from "url";
import path, { dirname } from "path";
import * as Storage from "@google-cloud/storage";
import fs from 'fs'
import {Base64} from 'js-base64';
import FormData from "form-data";
import axios from "axios";

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
    var base64file = "data:image/gif;base64," + fs.readFileSync(req.file.path, 'base64');
    //console.log(base64file);

    //Send to PDF Conversion API

    var formData = new FormData();
    const url = `https://getoutpdf.com/api/convert/image-to-pdf    `;
    const headers = {
      "Content-Type": "multipart/form-data",
      "Access-Control-Allow-Origin": "*",
    }
    formData.append("api_key", "ed4129c1077bfcfbe13885c696190a477b0ac821e09371b7076b2454cdb35c83");
    formData.append("image", base64file);
    formData.append("transparent_color","#ffffff" );

    const response = await axios.post(url, formData, headers);
    console.log(response.data.pdf_base64);
    console.log(response.data.tokens_used);
    console.log(response.data.tokens_left);

    var buf = Buffer.from(response.data.pdf_base64, 'base64');
    // Your code to handle buffer
    fs.writeFile(path.parse(req.file.originalname).name+".pdf", buf, error => {
        if (error) {
            throw error;
        } else {
            console.log('buffer saved!');
        }
    });

    await storage.bucket(bucketname).upload(buf, {
        destination: "completed/" + path.parse(req.file.originalname).name+".pdf",
    });


    res.send({
      status: "200",
      message: "File uploaded successfully! Processing..",
    });
  }
});




export default upload;

