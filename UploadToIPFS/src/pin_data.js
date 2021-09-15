require('dotenv').config();
const fs = require('fs');
const path = require('path');
const pinataSDK = require('@pinata/sdk');
const constants = require('./constants');
const extension = '.jpg';

const pinata = pinataSDK(process.env.PINATA_API_KEY, process.env.PINATA_SECRET_KEY);

pinFile = async (file, callback) => {
    const filePath = path.join(constants.ASSET, file + extension);
    const readableStreamForFile = fs.createReadStream(filePath);
    pinata.pinFileToIPFS(readableStreamForFile).then((result) => {
        // read, change, write json file here
        const jsonFile = path.join(constants.OUTPUT_PATH, constants.METADATA_FILE);
        fs.readFile(jsonFile, (err, data) => {
            if (err) throw err;
            let metaData = JSON.parse(data);
            metaData.image = "https://gateway.pinata.cloud/ipfs/" + result.IpfsHash;

            // write change back to the json file.
            fs.writeFile(jsonFile, JSON.stringify(metaData), (err) => {
                if (err) throw err;
                console.log('Json data change written back to file ' + jsonFile);
                callback();
            });
        });
    }).catch((err) => {
        //handle error here
        console.log(err);
    });
}

pinJson = async (callback) => {
    const jsonFile = path.join(constants.OUTPUT_PATH, constants.METADATA_FILE);

    fs.readFile(jsonFile, (err, data) => {
        let metaData = JSON.parse(data);
        pinata.pinJSONToIPFS(metaData).then((result) => {
            const ipfsHash = "https://gateway.pinata.cloud/ipfs/" + result.IpfsHash;
            callback(ipfsHash);
        }).catch((err) => {
            //handle error here
            console.log(err);
        });
    });
}

module.exports = {
    pinFile : pinFile,
    pinJson: pinJson,
}