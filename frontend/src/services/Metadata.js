const axios = require('axios');
const url_getMetaData = 'http://192.168.80.129:3001/getMetaData';
const url_deleteAccount = 'http://192.168.80.129:3001/deleteAccount';

export async function sendMetaDataRequest(donateType, account) {
  let metadata = "";
  let allowed = "";
  await axios.get(url_getMetaData,
  {
    params: {
      donateType: donateType,
      account: account
    }
  }).then(function (response) {
    metadata = response.data.ipfsHash;
    allowed = response.data.allowed;
  }).catch(function (error) {
    console.log(error);
  });
  // await getPairs().then(function(pairs) {
  //   const rand = Math.floor(Math.random() * pairs.length);
  //   metadata = pairs[rand].URI;
  // });
  return { metadata, allowed };
}

export async function sendDeleteRequest(account, donateType) {
  console.log(account, donateType);
  await axios.post(url_deleteAccount,
    {
      "account" : account,
      "donateType" : donateType
    });
}

export async function getMetaData() {
  let metadata;
  await getPairs().then(function(pairs) {
    const rand = Math.floor(Math.random() * pairs.length);
    metadata = pairs[rand].URI;
  });
  return metadata;
}

async function getPairs() {
  try {
    // let response = await fetch('http://localhost:3000/tokenId_cid_pair.json');
    let response = await fetch('https://blootavatar.web.app/tokenId_cid_pair.json');
    let responseJson = await response.json();
    return responseJson.pairs;
   } catch(error) {
    console.error(error);
  }
}

export async function getImageURI(tokenURI) {
  try {
    let response = await fetch(tokenURI);
    let responseJson = await response.json();
    return responseJson.image;
   } catch(error) {
    console.error(error);
  }
}
