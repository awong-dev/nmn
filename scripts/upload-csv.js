const admin = require("firebase-admin");
const asyncLib = require('async');
const csvParse = require('csv-parse');
const fs = require('fs');
const where = require('node-where');

// Connect to firebase.
function uploadToFirebase(data) {
  const serviceAccount = require(process.env.SERVICE_ACCOUNT_KEY || '../serviceAccountKey.json');
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
  const db = admin.firestore();
  const survey = db.collection('survey');
  console.log("uploading data");
  for (let entry of data) {
    console.log(`${entry['Entry Id']} = ${entry}`);
    survey.doc(entry['Entry Id']).set(entry);
  }
}

// Parse the data.
const parser = csvParse({delimiter: ','});
const output = [];
parser.on('readable', () => {
  while(record = parser.read()){
    output.push(record);
  }
});

// Catch any error
parser.on('error', (err) => {
  console.log(err.message);
  process.exit(1);
});

// When we are done, test that the parsed output matched what expected
parser.on('finish', () =>{
  const header = output[0];
  const ipIndex = header.indexOf('User IP');
  asyncLib.map(output.slice(1),
            (item, cb) => {
              where.is(item[ipIndex], (err, result) =>{
                const entry = {}
                for (let x = 0; x < item.length; x++) {
                  // Clear out the IP.
                  if (x === ipIndex) {
                    entry[header[x]] = null;
                  } else {
                    entry[header[x]] = item[x];
                  }
                }
                if (!err) {
                  entry['City'] = result.get('city');
                  entry['State'] = result.get('state');
                  entry['PostalCode'] = result.get('postalCode');
                  entry['Country'] = result.get('country');
                  entry['Lat'] = result.get('lat');
                  entry['Long'] = result.get('lng');
                }
                cb(null, entry);
              });
            },
            (err, results) => {
              if (err) {
                console.error(err);
                process.exit(1);
              }
              uploadToFirebase(results);
            });
});

// command is : node myscript.js filename
fs.createReadStream(process.argv[2]).pipe(parser);
