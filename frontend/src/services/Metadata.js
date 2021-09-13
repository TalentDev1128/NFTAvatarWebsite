export async function getMetaData() {
  let metadata;
  await getPairs().then(function(pairs) {
    console.log(pairs);
    const rand = Math.floor(Math.random() * pairs.length);
    metadata = pairs[rand].URI;
  });
  return metadata;
}

async function getPairs() {
  try {
    let response = await fetch('http://localhost:3000/tokenId_cid_pair.json');
    // let response = await fetch('https://blootavatar.web.app/tokenId_cid_pair.json');
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