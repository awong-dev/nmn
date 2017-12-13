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
  const batch = db.batch();
  const survey = db.collection('survey');
  console.log("uploading data");
  for (let entry of data) {
    if (entry) {
      console.log(`${entry['Entry Id']} = ${JSON.stringify(entry, null, 2)}`);
      const x = entry['Entry Id'];
      batch.set(db.collection('survey').doc(entry['Entry Id']), entry);
    }
  }
  console.log("committing");
  batch.commit();
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
                console.log(`locating ip ${item[ipIndex]}`);
                const entry = {}
                for (let x = 0; x < item.length; x++) {
                  // Clear out the IP.
                  if (x === ipIndex) {
                    entry[header[x]] = null;
                  } else {
                    entry[header[x]] = item[x];
                  }
                }
                if (err === null) {
                  entry['City'] = result.get('city') || null
                  entry['State'] = result.get('state') || null;
                  entry['PostalCode'] = result.get('postalCode') || null;
                  entry['Country'] = result.get('country') || null;
                  entry['Lat'] = result.get('lat') || null;
                  entry['Long'] = result.get('lng') || null;
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
