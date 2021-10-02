const axios = require('axios');

// const url_getMetaData = 'https://api.blootelves.family/api/getMetaData';
// const url_deleteAccount = 'https://api.blootelves.family/api/deleteAccount';
// const url_getCurrentState = 'https://api.blootelves.family/api/getCurrentState';

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

export function checkInvalidTraits(attributes) {
  const allowedTraitCategory = ["EYES", "HAT/HAIR", "FACIAL HAIR", "EARRING", "MOUTH", "EXTRAS", "CLOTHES", "SKIN", "BACKGROUND"];
  const allowedTraitNames = [
    [
      "Laser eyes of Bitcoin",
      "Laser eyes of ETH",
      "Laser eyes of Shitcoin",
      "Eyes of rare pepe",
      "Quartz-ruby visor of laser focus on drop",
      "Lazy eyes of 72h sleep deprivation",
      "Lazy eyes of 48h sleep deprivation",
      "Lazy eyes of 24h sleep deprivation",
      "Green VR goggles of blue pill",
      "Pink VR goggles of blue pill",
      "White VR goggles of blue pill",
      "Angry eyes of missed opportunity",
      "Wyepatch of focus",
      "Monocle of showing off Metamask balance",
      "Monobrow of grumpy day",
      "Squeezed eyes of trading NFTs on the toilet",
      "Tiny eyes of ye, sure",
      "dead eyes of liquidated",
      "Guilty eyes of bad meme",
      "Makeup eyes of zoom meeting",
      "Heart eyes of new gem spotted",
      "Naughty eyes of bidding 50 USDC",
      "Hollow eyes of bloot drop",
      "Hollow eyes of lost seed phrase",
      "Hollow eyes of accepted 50 USDC bid",
      "Hollow eyes of lost ledger",
      "Hollow eyes of hacked Metamask",
      "Confused eyes of huge ETH drop",
      "Sunglasses of hiding from normies",
      "Star eyes of escalating ETH",
      "Happy eyes of NFT sold for 5x",
      "Closed eyes freaming of 1000x",
      "Horizontal eyes of lunch with normies",
      "Surprised eyes of sudden dip",
      "Friendly eyes of let's be buddies"
    ],
    [
      "Cock hat or virility",
      "Green middle finger of Blootness WAGMI",
      "Red middle finger of WAGMI",
      "Purple middle finger of WAGMI",
      "Devil horns of FUD",
      "Gladiator Helm of the Metaverse Wars Bloot Division",
      "Gladiator Helm of the Metaverse Wars Golden Division",
      "Gladiator Helm of the Metaverse Wars Pink Division",
      "Propeller hat of Beanie",
      "Green unihorn of Blootness",
      "Golden unihorn of got rekt",
      "Purple unihorn of got rekt",
      "Artist hat of 7 figure NFT sales",
      "Artist hat of 6 figure NFT sales",
      "Artist hat of 5 figure NFT sales",
      "Flight attendant hat of ATH",
      "Wizard hat of magic pump",
      "Wizard hat of magic dump",
      "King's crown of WAGMI",
      "Bandana of Team Green",
      "Bandana of Team Purple",
      "Bandana of Team Red",
      "Orange beanie of Blootness",
      "Orange beanie of hipness",
      "Orange beanie of hipness",
      "Spikey mohawk of electrocution",
      "Cap of admitted NGMI",
      "Elf hat of Blootness",
      "Elf hat of trollness",
      "Elf hat of elfness",
      "Tophat of charlatanism",
      "Pirate hat of torrent",
      "Beret of Blootness",
      "Beret of guerilla marketing",
      "Beret of robinhoodness",
      "Party hat of alien dumpening",
      "Ponytail of jpeg summer",
      "Pigtails of cuteness",
      "Tied up mohawk of millennial fashion",
      "Reverse mohawk of can't undo",
      "Grease hair of sideways oscilation",
      "Emo hair of surely NGMI",
      "Wax mohawk of we kinda gonna make it",
      "Halo of ressurrection",
      "None"
    ],
    [
      "Hipster beard of degen",
      "Latino mustache of romance",
      "Muttonchops of wolfpack",
      "None"
    ],
    [
      "Cross earring of GM (George Michael)",
      "Spiked piercing of shill",
      "Silver earring of shy IRL",
      "Pirate earrings of NFT-savvy",
      "None"
    ],
    [
      "Blooty teeth of floor swept",
      "Diamond teeth of HODLd the right ones",
      "Golden teeth of just cashed out",
      "Bloody teeth of discord wars",
      "Mouth of rare pepe",
      "Lipstick lips of ETH influencer",
      "Lipstick lips of BTC influencer",
      "Smoking pipe of luck",
      "Angry mouth of just got outbid",
      "Puke of bloot",
      "Puke of blood",
      "Tongue of anon trolling",
      "Cigar puff of made it",
      "Mouth of shocked at rare at floor swept",
      "Open mouth of watching ETH going up",
      "Large Smile of putting up an NFT for sale",
      "No mouth of speechlessness",
      "Tiny mouth of NFT-rich at party",
      "Shy smile of tiny bid"
    ],
    [
      "Gfunk's wedding ring",
      "Chokers of rugging",
      "Chain of WAGMI",
      "None"
    ],
    [
      "Green armor of the metaverse wars",
      "Golden armor the metaverse wars",
      "Pink armor of the metaverse wars",
      "Superhero suit of tired tropes",
      "Angel tunic of blockchain heaven",
      "Priest Cassock of pray for ETH",
      "Female swimsuit of popular chick",
      "Punk jacket of bored anarchy",
      "Leather jacket with lambo keys",
      "Floral shirt of GM red",
      "Floral shirt of GM blue",
      "Striped shirt of no liquidity",
      "Robe of automatic pleasure",
      "Chest hair of malehood",
      "None"
    ],
    [
      "Bloot green",
      "Iridiscent",
      "Zombie",
      "Golden",
      "Red",
      "Purple",
      "Blue"
    ],
    [
      "Splurt",
      "Electric",
      "Stars",
      "Maze",
      "Hurricane",
      "Speedlines",
      "Bloot",
      "Plain green"
    ]
  ];
  let isValid = true;
  if (!attributes) {
    isValid = false;
    return isValid;
  }
  for(let i = 0; i < attributes.length; i++) {
    if (!allowedTraitCategory.includes(attributes[i].trait_type)) {
      isValid = false;
      break;
    }
    if (!allowedTraitNames[i].includes(attributes[i].value)) {
      isValid = false;
      break;
    }
  }
  return isValid;
}

function stringToHex(data) {
  let msg = '';
  for (let i = 0; i < data.length; i++) {
    let s = data.charCodeAt(i).toString(16);
    while (s.length < 2) {
      s = '0' + s;
    }
    msg += s;
  }
  return msg.padEnd(64, '0');
}
