import Express  from "express";
import cors from "cors"
import { v4 as uuid} from "uuid";

const app = Express();
const PORT = 3001; 
const SecretToken = uuid();
let requests = 0; 


app.get("/secret", (req, res) =>{
    const token = req.query.token;
    requests++;
    if(token === SecretToken){
        res.send({result: 200, requests: requests,message:"This is a secret message"});
    }else{
        res.send({result: 403, message: "Invalid credentials"});
    }
});

app.post("/login", (req, res) => {
    const email = req.query.email;
    const password = req.query.password;
    requests++;
    if (email == "test@test.com" && password == "123") {
      res.send("Hello test!");
    } else {
      res.send("Invalid credentials!");
    }
  });

app.use(cors());
//85ec3480-d832-494e-bdd8-2f52e083e76a

console.log(SecretToken);
app.listen(PORT, () =>
    console.log("Server Listening on port: "+PORT))