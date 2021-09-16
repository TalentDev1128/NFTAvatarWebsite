const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const constants = require('./constants');
const pinData = require('./pin_data');

const app = express();
app.use(cors({
    origin: '*'
}));

const doPremint = (donated, callback) => {
    chooseRandomFile(donated, function(fileName) {
        console.log(fileName);
        const subPath = donated == "true" ? constants.DONATED : constants.NOT_DONATED;
        const imageFile = path.join(__dirname, '..', constants.ASSET, subPath, fileName + '.jpg');
        const jsonFile = path.join(__dirname, '..', constants.ASSET, subPath, fileName + '.json');
        pinData.pinFile(imageFile, jsonFile, () => {
            pinData.pinJson(jsonFile, (ipfsHash) => {
                // delFile(imageFile, jsonFile);
                callback(ipfsHash);
            });
        });
    });
}

const chooseRandomFile = (donated, callback) => {
    //joining path of directory 
    const subPath = donated == "true" ? constants.DONATED : constants.NOT_DONATED;
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

const delFile = (imageFile, jsonFile) => {
    fs.unlink(imageFile, (err) => {
        if (err) {
            console.error(err);
            return;
        }      
    });
    fs.unlink(jsonFile, (err) => {
        if (err) {
            console.error(err);
            return;
        }      
    })
}

app.get('/', (req, res) => {
    const donated = req.query.donated || false;
    console.log(donated);
    doPremint(donated, (ipfsHash) => {
        console.log(ipfsHash);
        console.log('successfully sent ipfsHash');
        console.log('============');
        res.json({"ipfsHash" : ipfsHash});
    });
});
app.listen(process.env.PORT, () => console.log('Your app is listening on port ' + process.env.PORT));