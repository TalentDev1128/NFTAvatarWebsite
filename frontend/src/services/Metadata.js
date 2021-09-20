const axios = require('axios');

const url_getMetaData = 'https://api.blootelves.family/api/getMetaData';
const url_deleteAccount = 'https://api.blootelves.family/api/deleteAccount';
const url_getCurrentState = 'https://api.blootelves.family/api/getCurrentState';
// const url_getMetaData = 'http://localhost:3001/api/getMetaData';
// const url_deleteAccount = 'http://localhost:3001/api/deleteAccount';
// const url_getCurrentState = 'http://localhost:3001/api/getCurrentState';

export async function sendMetaDataRequest(donateType, account) {
  let metadata = "";
  let allowed = "";
  let tokenId = "";
  await axios.get(url_getMetaData,
  {
    params: {
      donateType: donateType,
      account: account
    }
  }).then(function (response) {
    metadata = response.data.ipfsHash;
    allowed = response.data.allowed;
    tokenId = response.data.tokenId;
  }).catch(function (error) {
    console.log(error);
  });
  return { metadata, allowed, tokenId };
}

export async function sendDeleteRequest(account, donateType) {
  console.log(account, donateType);
  await axios.get(url_deleteAccount,
  {
    params: {
      donateType: donateType,
      account: account
    }
  }).then(function () {
  }).catch(function (error) {
    console.log(error);
  });
  // await axios.post(url_deleteAccount,
  // {
  //   params: {
  //     donateType: donateType,
  //     account: account
  //   }
  // });
}

export async function getCurrentState() {
  let totalMint = "0/5000";
  let honoraryElves = "0/100";
  await axios.get(url_getCurrentState,
  {
    params: {
    }
  }).then(function (response) {
    totalMint = response.data.totalMint;
    honoraryElves = response.data.honoraryElves;
  }).catch(function (error) {
    console.log(error);
  });
  return { totalMint, honoraryElves };
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
    if (tokenURI) {
      let uriSplitted = tokenURI.split('/');
      if (uriSplitted[uriSplitted.length - 1]) {
        let response = await fetch(tokenURI);
        let responseJson = await response.json();
        return responseJson.image;
      }
      else
        return "";
   }
    else
      return "";
   } catch(error) {
    console.error(error);
  }
}
