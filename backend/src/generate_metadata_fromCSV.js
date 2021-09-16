const express = require('express');
const fs = require('fs');
const path = require('path');
const constants = require('./constants');
const csvParser = require('./csv_parser');
const pinData = require('./pin_data');
const extension = '.jpg';

const app = express();

// This array will be populated by the generateMetaData function
// Hence, use this array only after calling generateMetaData function.
let relativeIds = [];
let csvData = [];
let traits = [];

csvParser.parseCSV(function(data) {
    csvData = [...data];
    traits = traitIndices(csvData);
});

const preMint = (donated, callback) => {
    const randomPercents = generateRandomPercent(traits.length);
    const traitValueIds = generateTraitValueIds([...traits, csvData.length], randomPercents, csvData, donated);
    const tokenId = generateMetaData([...traits, csvData.length], traitValueIds, csvData);
    const imageFile = path.join(constants.ASSET, tokenId + extension);
    const jsonFile = path.join(constants.OUTPUT_PATH, constants.METADATA_FILE);
    pinData.pinFile(imageFile, jsonFile, () => {
        pinData.pinJson((ipfsHash) => {
            callback(ipfsHash);
        });
    });
}

app.get('/', (req, res) => {
    const donated = req.query.donated || false;
    console.log(donated);
    preMint(donated, (ipfsHash) => {
        console.log(ipfsHash);
        console.log('successfully sent ipfsHash');
        console.log('============');
        res.json({"ipfsHash" : ipfsHash});
    });
});
app.listen(process.env.PORT, () => console.log('Your app is listening on port ' + process.env.PORT));  

// calculate the indices of the trait categories, like HAIRS, EYES, first column in csv
traitIndices = data => {
    let indices = data.map((elem, idx) => elem.Total.length > 0 ? idx : '').filter(String);
    return indices;
}

// choose random numbers between 0~99
generateRandomPercent = count => {
    let randoms = [];
    for (let i = 0; i < count; i++) {
        let random = Math.floor(Math.random() * 100);
        randoms = [...randoms, random];
    }
    return randoms;
}

// calculate the indices of the trait values based on the random numbers
generateTraitValueIds = (traits, randomPercents, csvData, donated) => {
    let traitValueIds = [];
    for (let i = 0; i < randomPercents.length; i++) {
        let cumulation = 0.0;
        for (let j = traits[i] + 1; j < traits[i + 1]; j++) {
            let percent = donated ? csvData[j]['percent with donation'] : csvData[j]['percent'];
            cumulation += parseFloat(percent);
            if (cumulation >= randomPercents[i]) {
                // this row meets our needs, so mark it.
                traitValueIds = [...traitValueIds, j];
                break;
            }
        }
    }
    return traitValueIds;
}

// write metadata json file, prepare relative trait indices for PSD work
generateMetaData = (traits, traitValueIds, csvData) => {
    const metaDataFile = path.join(constants.OUTPUT_PATH, constants.METADATA_FILE);
    let tokenId = 0;
    let avatarJson = {};
    avatarJson.image = "";
    avatarJson.attributes = [];

    for (i = 0; i < traits.length - 1; i++) {
        let relativeId = traitValueIds[i] - traits[i];
        relativeIds.push(relativeId);

        let attrJson = {};
        attrJson.trait_type = csvData[traits[i]]['Total'];
        attrJson.value = csvData[traitValueIds[i]]['Display name on Open Sea'];
        avatarJson.attributes.push(attrJson);
        if (traits[i + 1] - traits[i] > 10)
            tokenId = tokenId * 100 + relativeId;
        else
            tokenId = tokenId * 10 + relativeId;
    }
    avatarJson.name = "bloot elves #" + tokenId;
    avatarJson.description = "bloot elves #" + tokenId;

    fs.writeFile(metaDataFile, JSON.stringify(avatarJson), (err) => {
        if (err) throw err;
        console.log('Metadata file written successfully');
    });
    return tokenId;
}