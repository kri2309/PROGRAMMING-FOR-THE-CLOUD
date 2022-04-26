import Express from "express";

import { fileURLToPath } from "url";
import path, { dirname } from "path";
import { validateToken } from "./auth.js";
import { GetUser, CreateUser} from "../db.js";



const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const payments = Express.Router();

payments.route("/").get((req,res) => {

    res.sendFile(path.join(__dirname, "../frontend/index.html"));

    
});

export default payments;