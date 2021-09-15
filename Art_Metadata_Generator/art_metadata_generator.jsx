#include 'json.jsx';

var groupLen = 0;
var pointers = [];
var layersInGroup = [];

function initializePointers(start) {
  var Grps = app.activeDocument.layerSets; // loops through all groups
  groupLen = Grps.length;
  for(var i = 0; i < Grps.length; i++){
    layersInGroup[i] = Grps[i].layers.length;
  }
  var myStart = start;
  for(var i = groupLen - 1; i > 0; i--) {
    var multiple = 1;
    for(var j = 0; j < i; j++) {
      multiple *= layersInGroup[j];
    }
    pointers[i] = Math.floor(myStart / multiple) + 1;
    myStart = myStart % multiple;
  }
  pointers[0] = myStart + 1;
}

function isEndReached() {
  var isEnd = true;
  for(var i = 0; i < groupLen; i++){
    if (pointers[i] < layersInGroup[i]) {
      isEnd = false;
      break;
    }
  }
  return isEnd;
}

function setAllInvisible() {
  var Grps = app.activeDocument.layerSets; // loops through all groups
  for(var i = 0; i < Grps.length; i++){
    app.activeDocument.layerSets[i].visible = false;
    var groupChildArr = app.activeDocument.layerSets[i].layers;
    for(var j = 0; j < groupChildArr.length; j++)
      groupChildArr[j].visible = false;
  }
}

function setCustomVisible() {
  var Grps = app.activeDocument.layerSets; // loops through all groups
  for(var i = 0; i < Grps.length; i++){
    app.activeDocument.layerSets[i].visible = true;
    var groupChildArr = app.activeDocument.layerSets[i].layers;
    // alert('i is ' + i + ' pointers[' + i + '] is ' + pointers[i]);
    groupChildArr[pointers[i] - 1].visible = true;
  }
}

function exportPng() {
  var outFolder = app.activeDocument; // psd name
  var outPath = outFolder.path;
  var folderName = "Output";   // define folder name
  var f = new Folder(outPath + "/" + folderName);
  if ( ! f.exists ) {
    f.create()
  }
  var fileName = generateName();
  var saveFile = new File(outPath + "/" + folderName +"/" + fileName + ".jpg");
  pngSaveOptions = new JPEGSaveOptions();
  pngSaveOptions.interlaced = false;
  app.activeDocument.saveAs(saveFile, pngSaveOptions, true, Extension.LOWERCASE);
}

function exportJsonFromLayers() {
  var nftImageJson = {};
  nftImageJson["name"] = "bloot";
  nftImageJson["description"] = "bloot elves";
  nftImageJson["image"] = "";
  nftImageJson["attributes"] = [];

  for(var i = 0; i < groupLen; i++){
    var attrJson = {};
    attrJson["trait_type"] = app.activeDocument.layerSets[i].name;
    attrJson["value"] = app.activeDocument.layerSets[i].layers[pointers[i] - 1].name; 
    nftImageJson["attributes"].push(attrJson);
  }

  var outFolder = app.activeDocument; // psd name
  var outPath = outFolder.path;
  var folderName = "Output";   // define folder name
  var f = new Folder(outPath + "/" + folderName);
  if ( ! f.exists ) {
    f.create()
  }
  var fileName = generateName();
  var saveFile = new File(outPath + "/" + folderName +"/" + fileName + ".json");

  saveFile.open('w');
  saveFile.write(JSON.lave(nftImageJson));
  saveFile.close();
}

function incrementPointer() {
  for (var i = 0; i < pointers.length; i++) {
    if (pointers[i] < layersInGroup[i]) {
      pointers[i] ++;
      if (i > 0) {
        for (var j = 0; j < i; j++) {
          pointers[j] = 1; 
        }
      }
      break;
    }
  }
}

function generateName() {
  var imageName = 0;
  imageName = pointers[0];
  for(var i = 1; i < groupLen; i++){
    if (layersInGroup[i] > 9)
      imageName = imageName * 100 + pointers[i];
    else
      imageName = imageName * 10 + pointers[i];
  }
  return imageName;
}

function Revert(){
   var idRvrt = charIDToTypeID( "Rvrt" );
   executeAction( idRvrt, undefined, DialogModes.NO );
}

function readCSV(fileName) {
  var file = File(File($.fileName).parent.fsName + '/' + fileName); // get the file
  file.encoding = 'UTF8'; // set some encoding
  file.lineFeed = 'Macintosh'; // set the linefeeds
  file.open('r',undefined,undefined); // read the file
  var content = file.read(); // get the text in it
  file.close(); // close it again
  var lines = content.split('\n');// split the lines (windows should be '\r')
  var data = [];// will hold the data
  var keys = lines[0].split(','); // get the heads

  Array.prototype.isEmpty = function (){
    return this.join().replace(/,/g,'').length === 0;
  };
  // loop the data
  for(var i = 1; i < lines.length;i++){
    var obj = {}; // temp object
    var cells = lines[i].split(',');// get the cells
    // assign them to the heads
    if (cells.isEmpty())
      continue;
    for (var j = 0; j < cells.length; j++)
      obj[keys[j]] = cells[j];
    data.push(obj); // add to data
  }
  return data;
}

// calculate the indices of the trait categories, like HAIRS, EYES, first column in csv
function traitIndices(data) {
  var indices = [];
  // We use 'Total' property from csv file
  for(var i = 0; i < data.length; i++){
    if(data[i]['Total'].length > 0){
      indices.push(i);
    }
  }

  // var indices = data.map(function(elem, idx) { return elem['Total'].length > 0 ? idx : ''}).filter(String);
  return indices;
}

// choose random numbers between 0~99
function generateRandomPercent(count) {
  var randoms = [];
  for (var i = 0; i < count; i++) {
      var random = Math.floor(Math.random() * 100);
      randoms.push(random);
  }
  return randoms;
}

// calculate the indices of the trait values based on the random numbers
function generateTraitValueIds(traits, randomPercents, csvData, donated) {
  var traitValueIds = [];
  for (var i = 0; i < randomPercents.length; i++) {
      var cumulation = 0.0;
      for (var j = traits[i] + 1; j < traits[i + 1]; j++) {
          var percent = donated ? csvData[j]['Percentage with donation'] : csvData[j]['Percentage'];
          cumulation += parseFloat(percent);
          if (cumulation >= randomPercents[i]) {
              // this row meets our needs, so mark it.
              traitValueIds.push(j);
              break;
          }
      }
  }
  return traitValueIds;
}

// write metadata json file, prepare relative trait indices for PSD work
function generateMetaData(traits, traitValueIds, csvData) {
  var tokenId = 0;
  var relativeIds = [];
  var avatarJson = {};
  avatarJson.image = "";
  avatarJson.attributes = [];

  for (i = 0; i < traits.length - 1; i++) {
      var relativeId = traitValueIds[i] - traits[i];
      relativeIds.push(relativeId);

      var attrJson = {};
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

  exportJsonFromData(avatarJson, tokenId);
  // return tokenId;
  return relativeIds;
}

function resetPointers(relativeIds) {
  for(var i = 0; i < relativeIds.length; i++)
    pointers[i] = relativeIds[i];
}

function exportJsonFromData(metaData, fileName) {
  var outFolder = app.activeDocument; // psd name
  var outPath = outFolder.path;
  var fName = "OUTPUT";   // define folder name
  var f = new Folder(outPath + "/" + fName);
  if ( ! f.exists ) {
    f.create()
  }
  var saveFile = new File(outPath + "/" + fName +"/" + fileName + ".json");
  saveFile.open('w');
  saveFile.write(JSON.lave(metaData));
  saveFile.close();
}

// 1 for sequential loop and export
// 2 for random export based on csv spreadsheet
var option = 2;

if (option == 1) {
  var start = 1; // 1 is minimum value
  initializePointers(start - 1);

  while(start++ < 5) {
    setAllInvisible();
    setCustomVisible();
    exportPng();
    //exportJsonFromLayers();
    // Revert();
    if (isEndReached()) {
      break;
    }
    incrementPointer();
  }
}
else {
  var csvName = 'Bloot Bros traits - Sheet1.csv';
  var donated = false;
  var imageCount = 30;

  initializePointers(0);
  var csvData = readCSV(csvName);
  var traits = traitIndices(csvData);

  var idx = 0;
  while(idx++ < imageCount) {
    var randomPercents = generateRandomPercent(traits.length);
    var traitValueIds = generateTraitValueIds(traits.concat(csvData.length), randomPercents, csvData, donated);
    var relativeIds = generateMetaData(traits.concat(csvData.length), traitValueIds, csvData);
    resetPointers(relativeIds);
    setAllInvisible();
    setCustomVisible();
    exportPng();
  }
}