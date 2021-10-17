const axios = require('axios');

const url_getOldIDs = 'https://api.blootelves.family/api/getOldIDs';
const url_saveMigrateSuccess = 'http://api.blootelves.family/api/saveMigrateSuccess';
// const url_getOldIDs = 'http://localhost:3001/api/getOldIDs';
// const url_saveMigrateSuccess = 'http://localhost:3001/api/saveMigrateSuccess';

export async function getOldIDs(tokenIDs) {
  let ids = [];
  let status = "";
  await axios.get(url_getOldIDs,
  {
    params: {
      tokenIDs: tokenIDs
    }
  }).then(function (response) {
    ids = response.data.ids;
    status = response.data.status;
  }).catch(function (error) {
    console.log(error);
  });
  return { ids, status };
}

export async function saveMigrateSuccess(account) {
  await axios.get(url_saveMigrateSuccess,
  {
    params: {
      account: account
    }
  }).then(function () {
  }).catch(function (error) {
    console.log(error);
  });
  return { };
}

export async function fetchAttributes(tokenURI) {
  try {
    let response = await fetch(tokenURI);
    let responseJson = await response.json();
    return responseJson.attributes;
   } catch(error) {
    console.error(error);
  }
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
      const _tokenURI = tokenURI.replace(/\u0000/g, '');
      let uriSplitted = _tokenURI.split('/');
      if (uriSplitted[uriSplitted.length - 1]) {
        let response = await fetch(_tokenURI);
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