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

const doPremint = (donateType, tokenId, callback) => {
    chooseRandomFile(donateType, function(fileName) {
        console.log(fileName);
        const subPath = donateType != "1" ? constants.DONATED : constants.NOT_DONATED;
        const imageFile = path.join(__dirname, '..', constants.ASSET, subPath, fileName + '.jpg');
        const jsonFile = path.join(__dirname, '..', constants.ASSET, subPath, fileName + '.json');
        pinData.pinFile(imageFile, jsonFile, tokenId, () => {
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
                allowed = false;
                callback(allowed);
            }
            let arrData;
            let strData = "";
            if (data) {
                console.log('==', data.toString());
                arrData = data.toString().split("\n");
                arrData.push(account);
                strData = arrData.join("\n");
            } else
                strData = account;
            
            fs.writeFile(fileName, strData, (err) => {
                if (err) {
                    allowed = false;
                    callback(allowed);
                }
            });
            callback(allowed);
        });
    }
    if (donateType == "4") {
        fileName = path.join(__dirname, '..', constants.OUTPUT_PATH, constants.PEOPLE_DONATED_05);
        fs.readFile(fileName, (err, data) => {
            if (err) {
                allowed = false;
                callback(allowed);
            }
            let arrData;
            let strData = "";
            if (data) {
                console.log('==', data.toString());
                arrData = data.toString().split("\n");
                arrData.push(account);
                strData = arrData.join("\n");
            } else
                strData = account;

            if (arrData.length >= 100) {
                allowed =false;
                callback(allowed);
            } else {
                fs.writeFile(fileName, strData, (err) => {
                    if (err) {
                        allowed = false;
                        callback(allowed);
                    }
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

const updateMintedIDs = (callback) => {
    fileName = path.join(__dirname, '..', constants.OUTPUT_PATH, constants.MINTED_IDS);
    fs.readFile(fileName, (err, data) => {
        if (err) {
            console.error(err);
            let randID = Math.floor(Math.random() * 10000) + 10000;
            callback(randID.toString());
            return;
        }
        let mintedIDs = [];
        let updatedIDs = "";
        let newID = (Math.floor(Math.random() * 10000) + 10000).toString();
        if (data && data.length != 0) {
            mintedIDs = data.toString().split("\n");
            newID = parseInt(mintedIDs[mintedIDs.length - 1]) + 1;
            mintedIDs.push(newID.toString());
            updatedIDs = mintedIDs.join("\n");
        } else {
            updatedIDs = newID;
        }
        fs.writeFile(fileName, updatedIDs, (err) => {
            if (err) throw err;
        });
        callback(newID);
    });
}

app.get('/api/getMetaData', (req, res) => {
    const { account, donateType } = req.query;
    console.log(donateType, account);
    updateMintCount(true);
    insertPeopleDonated(donateType, account, (allowed) => {
        if (!allowed)
            res.json({"ipfsHash" : "", "allowed" : false, "tokenId" : "0"});
        else {
            updateMintedIDs(function(newID) {
                doPremint(donateType, newID, (ipfsHash) => {
                    console.log(ipfsHash);
                    console.log('successfully sent ipfsHash');
                    console.log('============');
                    res.json({"ipfsHash" : ipfsHash, "allowed" : true, "tokenId" : newID});
                });
            });
        }
    });
});

app.get('/api/deleteAccount', (req, res) => {
    // const { account, donateType } = req.body;
    const { account, donateType } = req.query;
    let fileName = "";
    if (donateType == "3")
        fileName = path.join(__dirname, '..', constants.OUTPUT_PATH, constants.PEOPLE_DONATED_004);
    if (donateType == "4")
        fileName = path.join(__dirname, '..', constants.OUTPUT_PATH, constants.PEOPLE_DONATED_05);
    updateMintCount(false);
    if (donateType == "3" || donateType == "4") {
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
    }
    res.json({"status": "1"});
});

app.get('/api/getCurrentState', (req, res) => {
    const mintFileName = path.join(__dirname, '..', constants.OUTPUT_PATH, constants.TOTAL_MINT);
    let totalMint = "0/5000";
    let honoraryElves = "0/100";
    fs.readFile(mintFileName, (err, data) => {
        if (err) {
            console.error(err);
            res.json({"totalMint": "0", "honoraryElves": "0"});
        }
        if (data && data.toString().length != 0)
            totalMint = data.toString();
    
        const honorarFileName = path.join(__dirname, '..', constants.OUTPUT_PATH, constants.PEOPLE_DONATED_05);
        fs.readFile(honorarFileName, (err, data) => {
            if (err) {
                console.error(err);
                res.json({"totalMint": totalMint, "honoraryElves": "0"});
            }
            if (data) {
                let totalHonorary = data.toString().split("\n").length;
                honoraryElves = totalHonorary + "/100";
                res.json({"totalMint": totalMint, "honoraryElves": honoraryElves});
            }
        });
    });
});

app.get('/api/getOldIDs', (req, res) => {
    const { tokenIDs } = req.query;
    console.log(tokenIDs);

    const pairFilePath = path.join(__dirname, '..', constants.OUTPUT_PATH, constants.OLD_NEW_ID_PAIR);
    fs.readFile(pairFilePath, (err, data) => {
        if (err) {
            console.error(err);
            res.json({"ids": [], "status": "fail"});
        }
        if (data) {
            let pairs = JSON.parse(data);
            let ids = [];
            for (let i = 0; i < tokenIDs.length; i++) {
                let tokenId = tokenIDs[i];
                ids.push(pairs[tokenId]);
            }
            if (ids.length != 0)
                res.json({"ids": ids, "status": "success"});
            else
                res.json({"ids": [], "status": "fail"});
        }
    });
});

app.get('/api/saveMigrateSuccess', (req, res) => {
    const { account } = req.query;

    const migratedFilePath = path.join(__dirname, '..', constants.OUTPUT_PATH, constants.PEOPLE_MIGRATED);
    fs.appendFile(migratedFilePath, account + "\n", function (err) {
        if (err) {
            // append failed
            console.error(err);
            res.json({});
        } else {
            // done
            res.json({});
        }
    });
});

app.listen(process.env.PORT, () => console.log('Your app is listening on port ' + process.env.PORT));