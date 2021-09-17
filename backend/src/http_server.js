const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const constants = require('./constants');
const pinData = require('./pin_data');

const app = express();
app.use(cors({
    origin: '*'
}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const doPremint = (donateType, callback) => {
    chooseRandomFile(donateType, function(fileName) {
        console.log(fileName);
        const subPath = donateType != "1" ? constants.DONATED : constants.NOT_DONATED;
        const imageFile = path.join(__dirname, '..', constants.ASSET, subPath, fileName + '.jpg');
        const jsonFile = path.join(__dirname, '..', constants.ASSET, subPath, fileName + '.json');
        pinData.pinFile(imageFile, jsonFile, () => {
            pinData.pinJson(jsonFile, (ipfsHash) => {
                moveFile(donateType, fileName);
                callback(ipfsHash);
            });
        });
    });
}

const chooseRandomFile = (donateType, callback) => {
    //joining path of directory 
    const subPath = donateType != "1" ? constants.DONATED : constants.NOT_DONATED;
    const directoryPath = path.join(__dirname, '..', constants.ASSET, subPath);
    //passsing directoryPath and callback function
    fs.readdir(directoryPath, function (err, files) {
        //handling error
        if (err) {
            return console.log('Unable to scan directory: ' + err);
        } 
        const random = Math.floor(Math.random() * files.length);
        const fileName = files[random].split('.')[0];
        callback(fileName);
    });
}

const moveFile = (donateType, fileName) => {
    const subPath1 = donateType != "1" ? constants.DONATED : constants.NOT_DONATED;
    const subPath2 = donateType != "1" ? constants.DONATED_DELETED : constants.NOT_DONATED_DELETED;
    const srcImageFile = path.join(__dirname, '..', constants.ASSET, subPath1, fileName + '.jpg');
    const srcJsonFile = path.join(__dirname, '..', constants.ASSET, subPath1, fileName + '.json');
    const dstImageFile = path.join(__dirname, '..', constants.ASSET, subPath2, fileName + '.jpg');
    const dstJsonFile = path.join(__dirname, '..', constants.ASSET, subPath2, fileName + '.json');
    fs.rename(srcImageFile, dstImageFile, function (err) {
        if (err) throw err
        console.log('Successfully renamed - ' + fileName + '.jpg !')
    });
    fs.rename(srcJsonFile, dstJsonFile, function (err) {
        if (err) throw err
        console.log('Successfully renamed - ' + fileName + '.json !')
    });
}

const insertPeopleDonated = (donateType, account, callback) => {
    let allowed = true;
    let fileName = "";
    if (donateType == "1" || donateType == "2")
        callback(allowed);
    if (donateType == "3") {
        fileName = path.join(__dirname, '..', constants.OUTPUT_PATH, constants.PEOPLE_DONATED_004);
        fs.readFile(fileName, (err, data) => {
            if (err) {
                fs.writeFile(fileName, account, (err) => {
                    if (err) throw err;
                });
            }
            let arrData;
            if (data) {
                console.log('==', data.toString());
                arrData = data.toString().split("\n");
            } else
                arrData = [];
            arrData.push(account);
            
            fs.writeFile(fileName, arrData.join("\n"), (err) => {
                if (err) throw err;
            });
            callback(allowed);
        });
    }
    if (donateType == "4") {
        fileName = path.join(__dirname, '..', constants.OUTPUT_PATH, constants.PEOPLE_DONATED_05);
        fs.readFile(fileName, (err, data) => {
            if (err) {
                fs.writeFile(fileName, account, (err) => {
                    if (err) throw err;
                });
            }
            let arrData;
            if (data) {
                console.log('==', data.toString());
                arrData = data.toString().split("\n");
            } else
                arrData = [];

            if (arrData.length >= 100) {
                allowed =false;
                callback(allowed);
            } else {
                arrData.push(account);
                fs.writeFile(fileName, arrData.join("\n"), (err) => {
                    if (err) throw err;
                });
                callback(allowed);
            }
        });
    }
}

const updateMintCount = (increase) => {
    fileName = path.join(__dirname, '..', constants.OUTPUT_PATH, constants.TOTAL_MINT);
    fs.readFile(fileName, (err, data) => {
        if (err) {
            console.error(err);

            fs.writeFile(fileName, '0/5000'.toString(), (err) => {
                if (err) throw err;
            });
            return;
        }
        let currentMint = 0;
        // console.log('==', data.toString());
        if (data && data.toString().length != 0)
            currentMint = parseInt(data.toString().split("/")[0]);
        if (increase)
            currentMint += 1;
        else
            currentMint = currentMint == 0 ? 0 : currentMint - 1;
        
        fs.writeFile(fileName, (currentMint + '/5000').toString(), (err) => {
            if (err) throw err;
        });
    });
}

app.get('/getMetaData', (req, res) => {
    const donateType = req.query.donateType;
    const account = req.query.account;
    console.log(donateType, account);
    updateMintCount(true);
    insertPeopleDonated(donateType, account, (allowed) => {
        if (!allowed)
            res.json({"ipfsHash" : "", "allowed" : false});
        else {
            doPremint(donateType, (ipfsHash) => {
                console.log(ipfsHash);
                console.log('successfully sent ipfsHash');
                console.log('============');
                res.json({"ipfsHash" : ipfsHash, "allowed" : true});
            });
        }
    });
});

app.post('/deleteAccount', (req, res) => {
    const { account, donateType } = req.body;
    let fileName = "";
    if (donateType == "3")
        fileName = path.join(__dirname, '..', constants.OUTPUT_PATH, constants.PEOPLE_DONATED_004);
    if (donateType == "4")
        fileName = path.join(__dirname, '..', constants.OUTPUT_PATH, constants.PEOPLE_DONATED_05);
    updateMintCount(false);
    fs.readFile(fileName, (err, data) => {
        if (err) {
            console.error(err);
        }
        if (data) {
            let arrData = data.toString().split("\n");
            const idx = arrData.lastIndexOf(account);
            arrData.splice(idx, 1);

            fs.writeFile(fileName, arrData.join("\n"), (err) => {
                if (err) throw err;
            });
        }
    });
});

app.listen(process.env.PORT, () => console.log('Your app is listening on port ' + process.env.PORT));