const fs = require('fs');
const path = require('path');
const csvParser = require('./csv_parser');
const constants = require('./constants');

// This array will be populated by the generateMetaData function
// Hence, use this array only after calling generateMetaData function.
let relativeIds = [];

csvParser.parseCSV(function(csvData) {
    console.log(csvData.length);
    const traits = traitIndices(csvData);
    console.log(traits);
    const randomPercents = generateRandomPercent(traits.length);
    console.log(randomPercents);
    const donated = false;
    const traitValueIds = generateTraitValueIds([...traits, csvData.length], randomPercents, csvData, donated);
    console.log(traitValueIds);
    generateMetaData([...traits, csvData.length], traitValueIds, csvData);
    console.log(relativeIds);
});

// calculate the indices of the trait types, like HAIRS, EYES, first column in csv
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
    // let tokenId = traitValueIds[0] - traits[0];
    let avatarJson = {};
    avatarJson.name = "bloot";
    avatarJson.description = "bloot elves";
    avatarJson.image = "";
    avatarJson.attributes = [];
    
    for (i = 1; i < traits.length - 1; i++) {
        let relativeId = traitValueIds[i] - traits[i] - 1;
        relativeIds.push(relativeId);

        let attrJson = {};
        attrJson.trait_type = csvData[traits[i]]['Total'];
        attrJson.value = csvData[traitValueIds[i]]['Display name on Open Sea'];
        avatarJson.attributes.push(attrJson);
        // if (traits[i + 1] - traits[i] > 10)
        //     tokenId = tokenId * 100 + relativeId;
        // else
        //     tokenId = tokenId * 10 + relativeId;
    }
    // console.log(tokenId);

    // const pair_file_path = path.join(outPath, tokenId_cid_pair_file);
    fs.writeFile(metaDataFile, JSON.stringify(avatarJson), (err) => {
        if (err) throw err;
        console.log('Metadata file written successfully');
    });
}