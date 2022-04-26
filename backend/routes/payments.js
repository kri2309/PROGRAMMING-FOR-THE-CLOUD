import Express from "express";

import { fileURLToPath } from "url";
import path, { dirname } from "path";
import { validateToken } from "./auth.js";
import { GetUser, CreateUser} from "./db.js";



const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const payments = Express.Router();

payments.route("/").get((req,res) => {
    res.sendFile(path.join(__dirname, "../frontend/index.html"));

    GetUser(email).then( async function(response){
        if(response.length > 0){
          console.log("found user "+response[0].credits );
          res.send({ result: "exists", reason: "Found email", credits: response[0].credits, admin: response[0].admin});
    
        }
        else{
          const r = await CreateUser(email);
          res.send({ result: "created", reason: "Created email", credits:10, admin: false});
        }
      });
    
});

export default payments;