const asyncLib = require('async');
const csvParse = require('csv-parse');
const fs = require('fs');
const where = require('node-where');
const url = require('url');

const IntegralFields = {
  'Entered-Negative': null,
  'Entered-Suicidal': null,
  'Now-Negative': null,
  'Now-Suicidal': null,
  'Entry Id': null,
};

const BooleanFields = {
  'male ages 36-64': null,
  'mental health provider': null,
  'other healthcare provider': null,
};

const DateTimeFields = {
  "Entry Date": null,
  "Payment Date": null,
};

// Parse the data.
const parser = csvParse({delimiter: ','});
const output = [];
parser.on('readable', () => {
  while(record = parser.read()){
    output.push(record);
  }
});

const ip_to_id = {};
let current_ip_id = 1;
function anonymize_ip(ip) {
  if (ip_to_id[ip] === undefined) {
    ip_to_id[ip] = current_ip_id;
    current_ip_id = current_ip_id + 1;
  }
}

// Converts field data from strings to more suitable types.
// Scrubs data fields except for User IP.
function clean_fields(item, header) {
  for (let x = 0; x < item.length; x++) {
    const header_value = header[x];
    if (IntegralFields.hasOwnProperty(header_value)) {
      item[x] = parseInt(item[x]);
    } else if (BooleanFields.hasOwnProperty(header_value)) {
      item[x] = item[x] !== '';
    } else if (DateTimeFields.hasOwnProperty(header_value)) {
      item[x] = new Date(`${item[x]} PST`);  // NMN database runs in PST.
    }

    // Only keep the pathname. Drop query string for privacy. Drop host name for space.
    if (header_value === 'Source Url') {
      item[x] = url.parse(item[x]).pathname;
    }
  }
}

function process_row(row, header, cb) {
  const ipIndex = header.indexOf('User IP');
  // Overwite IP with anonymized verison.
  const ip = row[ipIndex];
  row[ipIndex] = anonymize_ip(ip);

  clean_fields(row, header);
  fill_in_geo(ip, row, cb, 3);
}

function output_results(err, header, rows) {
  if (err) {
    console.error(err);
    process.exit(1);
  }

  const HeadersForOutput = {
    "Entered-Negative": null,
    "Entered-Suicidal": null,
    "Now-Negative": null,
    "Now-Suicidal": null,
    "male ages 36-64": null,
    "mental health provider": null,
    "other healthcare provider": null,
    "Entry Date": null,
    "Source Url": null,
    "User IP": null,
    'State': null,
    'Country': null
  };

  // Initialize Headers.
  for (let i = 0; i < header.length; i++) {
    const header_value = header[i];
    if (HeadersForOutput.hasOwnProperty(header_value)) {
      HeadersForOutput[header_value] = i;
    }
  }
  const results = {
    header: Object.keys(HeadersForOutput),
    data: {},
  }
  const entryIdIndex = header.indexOf('Entry Id');
  for (let r of rows) {
    const new_row = [];
    for (let i = 0; i < r.length; i++) {
      const header_value = header[i];
      if (HeadersForOutput.hasOwnProperty(header_value)) {
        new_row[results.header.indexOf(header_value)] =
          r.data[HeadersForOutput[header_value]];
      }
    }
    results.data[r[entryIdIndex]] = new_row;
  }
  console.log(JSON.stringify(results));
}

function fill_in_geo(ip, item, cb, retries) {
  where.is(ip, (err, result) =>{
    if (err === null) {
      item.push(result.get('region') || null,
                result.get('country') || null);
    } else {
      if (retries > 0) {
        // Hacky back-off with jitter on failure.
        const waitTill = new Date(new Date().getTime() + Math.floor(Math.random() * (10 - 2 + 1) + 2));
        while(waitTill > new Date()){}
        fill_in_geo(ip, item, cb, retries - 1);
        return;
      }
      console.error(`Unable to lookup ${ip}`, err);
    }
    cb(null, item);
  });
}

// Catch any error
parser.on('error', (err) => {
  console.log(err.message);
  process.exit(1);
});

// When we are done, test that the parsed output matched what expected
parser.on('finish', () =>{
  const header = output[0];
  header.push('State', 'Country');

  const data_rows = output.slice(1);
  asyncLib.map(data_rows,
               (row, cb) => process_row(row, header, cb),
               (err, rows) => output_results(err, header, rows));
});

// command is : node myscript.js filename
fs.createReadStream(process.argv[2]).pipe(parser);
