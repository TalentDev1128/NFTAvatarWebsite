#include 'json.jsx'

var groupLen = 0;
var pointers = [];
var layersInGroup = [];

function initializePointers(start) {
  // var Grps = app.activeDocument.layerSets; // loops through all groups
  // groupLen = Grps.length;
  // for(var i = 0; i < Grps.length; i++){
  //   pointers[i] = 0;
  //   layersInGroup[i] = Grps[i].layers.length;
  // }
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

function exportJson() {
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

var start = 1; // 1 is minimum value
initializePointers(start - 1);

while(start++ < 5) {
  setAllInvisible();
  setCustomVisible();
  exportPng();
  //exportJson();
  // Revert();
  if (isEndReached()) {
    break;
  }
  incrementPointer();
}