import Express from "express";

import { fileURLToPath } from "url";
import path, { dirname } from "path";
import { validateToken } from "./auth.js";



const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const payments = Express.Router();

payments.route("/payments").get((req,res) => {
 
 res.sendFile(path.join(__dirname, "../../frontend/public/payments.html"));

 $(function() {
    $('[data-toggle="tooltip"]').tooltip()
    })
});

export default payments;