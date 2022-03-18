import Express from "express";
import cors from "cors";
import { v4 as uuid } from "uuid";
import session from "express-session";
import {
  CreateUser,
  GetUser,
  HashPassword,
  GOOGLE_APPLICATION_CREDENTIALS,
} from "./db.js";
import { fileURLToPath } from "url";
import path, { dirname } from "path";

import https from "https";
import { SecretManagerServiceClient } from "@google-cloud/secret-manager";

const PORT = 443;

const startServerEncrypted = async () => {
  const sm = new SecretManagerServiceClient({
    projectId: "programmingforthecloud-340711",
    keyFilename: GOOGLE_APPLICATION_CREDENTIALS,
  });
  const [pub] = await sm.accessSecretVersion({
    name: "projects/924492803178/secrets/PublicKey/versions/1",
  });

  const [prvt] = await sm.accessSecretVersion({
    name: "projects/924492803178/secrets/PrivateKey/versions/1",
  });

  const sslOptions = {
    key: prvt.payload.data.toString(),
    cert: pub.payload.data.toString(),
  };

  https.createServer(sslOptions, app).listen(PORT, () => {
    console.log("Secure Server Listening on port:" + PORT);
  });
};

const startServer = async () => {
  app.listen(PORT, () => console.log("Server Listening on port: " + PORT));
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

//Session config
const config = {
  genid: (req) => uuid(),
  secret: "keyboard cat",
  cookie: {},
  resave: false,
  saveUninitialized: true,
};

const app = Express();
app.use(Express.static(path.join(__dirname, "../frontend/public")));
app.use(cors());
app.use(session(config));

//Delivering static files

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/login.html"));
});

app.get("/register", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/register.html"));
});

app.post("/login", (req, res) => {
  const email = req.query.email;
  const password = req.query.password;
  requests++;

  GetUser(email).then((r) => {
    //if this email address is not taken
    if (r.length === 1) {
      //Save the user to the database
      if (r[0].password === HashPassword(password)) {
        //Passwords matched
        console.log("Login success!");
        res.send({ result: "success", email: email, name: r[0].name });
      } else {
        //Passwords did not match
        console.log("Login failed! Invalid credentials");
        res.send({ result: "fail", reason: "Invalid credentials" });
      }
    } else {
      //Account does not exist
      console.log("Login failed! Account does not exist.");
      res.send({ result: "fail", reason: "Account does not exist" });
    }
  });
});

app.post("/register", (req, res) => {
  const email = req.query.email;
  const password = req.query.password;
  const name = req.query.name;
  const surname = req.query.surname;
  requests++;
  //Step 1: Check if that email address already exists
  //Step 2: If the email is not registered in the database we create it
  //Step 3: If the account was created successfully we inform the user
  GetUser(email).then((r) => {
    //if this email address is not taken
    if (r.length === 0) {
      //Save the user to the database
      CreateUser(name, surname, email, password)
        .then((r) => {
          res.send({ result: "success", email: email, name: name });
        })
        .catch((e) => console.log(e));
    } else {
      res.send({ result: "fail", reason: "Account already exists" });
    }
  });
});

//startServer();

startServerEncrypted();