require('dotenv').config()
const fs = require('fs');
const path = require('path');
const pinataSDK = require('@pinata/sdk');
const imagePath = './assets';
const outPath = './output';
const tokenId_cid_pair_file = 'tokenId_cid_pair.json';

const pinata = pinataSDK(process.env.PINATA_API_KEY, process.env.PINATA_SECRET_KEY);
let tokenId_cid_pair = {};
let count = 0; // number of image files to read
const doAction = process.argv[2] || "1"; // 1 or 2, 1 for processing image files, 2 for processing metadata files

const pinFile = (readableStreamForFile, jsonFile) => {
    pinata.pinFileToIPFS(readableStreamForFile).then((result) => {
        // read, change, write json file here
        fs.readFile(jsonFile, (err, data) => {
            if (err) throw err;
            let metaData = JSON.parse(data);
            metaData.image = result.IpfsHash;

            // write change back to the json file.
            fs.writeFile(jsonFile, JSON.stringify(metaData), (err) => {
                if (err) throw err;
                console.log('Json data change written back to file ' + jsonFile);
            });
        });
    }).catch((err) => {
        //handle error here
        console.log(err);
    });
};

const pinJSON = (metaData, jsonFile, index) => {
    pinata.pinJSONToIPFS(metaData).then((result) => {
        // save tokenId & cid to the tokenId_cid_pair variable
        console.log(result);
        let newPair = {};
        newPair.id = jsonFile.substr(0, jsonFile.length - 5);
        newPair.URI = result.IpfsHash;

        // check if tokenId_cid_pair json contains newPair element
        if (tokenId_cid_pair.filter(e => e.id === newPair.id).length > 0) {
            return;
        }
        tokenId_cid_pair.push(newPair);
        // write token_cid_pair back to the file at the end of the loop
        writePairToFile();
    }).catch((err) => {
        //handle error here
        console.log(err);
        writePairToFile();
    });
};

const writePairToFile = () => {
    let pairsJson = {}
    pairsJson.pairs = tokenId_cid_pair;
    fs.writeFile(pair_file_path, JSON.stringify(pairsJson), (err) => {
        if (err) throw err;
        console.log('Pairs file written successfully');
    });
}

// read tokenId_cid_pair.json file and save the json to the variable in memory
const pair_file_path = path.join(outPath, tokenId_cid_pair_file);
fs.readFile(pair_file_path, (err, data) => {
    if (err) {
        tokenId_cid_pair = [];
        return;
    }
    try {
        tokenId_cid_pair = JSON.parse(data).pairs;
    } catch(err) {
        tokenId_cid_pair = [];
        return;
    }
});

// read image files and save IpfsHash to metadata json file
if (doAction === "1") {
    fs.readdir(imagePath, function (err, files) {
        if (err) {
            console.error("Could not list the directory.", err);
            process.exit(1);
        }

        files.forEach(function (file, index) {
            if (!file.endsWith(".jpg") && !file.endsWith(".png")) {
                return;
            }
            console.log('processing file ' + file + '...');
            const filePath = path.join(imagePath, file);
            const readableStreamForFile = fs.createReadStream(filePath);
            const jsonFile = path.join(imagePath, file.replace(/jpg|jpeg|png/, 'json'));
            pinFile(readableStreamForFile, jsonFile);
        });
    });
}

// read metadata json files and save IpfsHash to tokenId_cid_pair.json file
if (doAction === "2") {
    fs.readdir(imagePath, function (err, files) {
        if (err) {
            console.error("Could not list the directory.", err);
            process.exit(1);
        }

        count = files.length;
        files.forEach(function (file, index) {
            if (!file.endsWith(".json")) {
                return;
            }
            console.log('processing file ' + file + '...');
            const jsonFile = path.join(imagePath, file);
            const idx = index;

            fs.readFile(jsonFile, (err, data) => {
                let metaData = JSON.parse(data);
                pinJSON(metaData, file, idx);
            });
        });
    });
}