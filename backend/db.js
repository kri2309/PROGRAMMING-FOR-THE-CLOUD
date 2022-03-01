import Firestore from "@google-cloud/firestore"

export const GOOGLE_APPLICATION_CREDENTIALS="./key.json"

const Firestore = require('@google-cloud/firestore');

const db = new Firestore({
  projectId: 'programmingforthecloud-340711',
  keyFilename: GOOGLE_APPLICATION_CREDENTIALS
,
});

const docRef = db.collection('PFC').doc('users');

export async function CreateUser(name, surname, eamil, password){

    return await docRef.set({
        name: name,
        surname: surname,
        eamil: eamil,
        password: password,
    });
}