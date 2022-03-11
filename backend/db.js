import Firestore from "@google-cloud/firestore";
import { createHmac } from "crypto";

//Google Cloud key
export const GOOGLE_APPLICATION_CREDENTIALS = "./key.json";

//Instantiating Firestore with project details
const db = new Firestore({
  projectId: "pftc0000001",
  keyFilename: GOOGLE_APPLICATION_CREDENTIALS,
});

//Collection (Table)
//Document (Row)
//docRef selects the collection
export async function CreateUser(name, surname, email, password) {
  const docRef = db.collection("users").doc();
  return await docRef.set({
    name: name,
    surname: surname,
    email: email,
    password: HashPassword(password),
  });
}

export async function GetUser(email) {
  const docRef = db.collection("users");
  const snapshot = await docRef.where("email", "==", email).get();
  let data = [];
  snapshot.forEach((doc) => {
    data.push(doc.data());
  });
  return data;
}

export function HashPassword(password) {
  const secret = "i<3PfC";
  return createHmac("sha256", password).update(secret).digest("hex");
}