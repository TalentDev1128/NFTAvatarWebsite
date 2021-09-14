const fs = require('fs');
const path = require('path');
const csv = require('fast-csv');
const constants = require('./constants');

let csvData = [];

parseCSV = async (callback) => {
    await fs.createReadStream(path.resolve(__dirname, '..', constants.CSV_FILE))
        .pipe(csv.parse({ headers: true, ignoreEmpty: true }))
        .on('error', error => console.error(error))
        .on('data', row => { 
            csvData = [...csvData, row];
        })
        .on('end', rowCount => {
            console.log(`Parsed ${rowCount} rows`);
            callback(csvData);
            return csvData;
        });
}

module.exports = {
    parseCSV : parseCSV,
}