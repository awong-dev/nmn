const admin = require("firebase-admin");
const fs = require('fs');

// Connect to firebase.
function uploadToFirebase(data) {
  const serviceAccount = require(process.env.SERVICE_ACCOUNT_KEY || '../serviceAccountKey.json');
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
  const db = admin.firestore();
  const batch = db.batch();
  const survey = db.collection('nmn').doc('surveydata').set(data);
}

// Uck. This is ugly and sorta unsafe.
const data = JSON.parse(fs.readFileSync(process.argv[2]));
uploadToFirebase(data);
