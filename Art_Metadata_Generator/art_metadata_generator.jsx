#include 'json.jsx'

var groupLen = 0;
var pointers = [];
var layersInGroup = [];

function initializePointers() {
  var Grps = app.activeDocument.layerSets; // loops through all groups
  groupLen = Grps.length;
  for(var i = 0; i < Grps.length; i++){
    pointers[i] = 0;
    layersInGroup[i] = Grps[i].layers.length;
  }
}

function isEndReached() {
  var isEnd = true;
  for(var i = 0; i < groupLen; i++){
    if (pointers[i] < layersInGroup[i] - 1) {
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
    // var tmp = app.activeDocument.layerSets[i].layers.length;
    app.activeDocument.layerSets[i].visible = true;
    var groupChildArr = app.activeDocument.layerSets[i].layers;
    // var randLays = Math.floor(Math.random() * tmp);
    groupChildArr[pointers[i]].visible = true;
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
  nftImageJson["description"] = "Test Test Test";
  nftImageJson["image"] = "";
  nftImageJson["attributes"] = [];

  for(var i = 0; i < groupLen; i++){
    var attrJson = {};
    attrJson["trait_type"] = app.activeDocument.layerSets[i].name;
    attrJson["value"] = app.activeDocument.layerSets[i].layers[pointers[i]].name; 
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
    if (pointers[i] < layersInGroup[i] - 1) {
      pointers[i] ++;
      if (i > 0) {
        for (var j = 0; j < i; j++) {
          pointers[j] = 0; 
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

initializePointers();

var i = 0;
while(i++ < 10) {
  setAllInvisible();
  setCustomVisible();
  exportPng();
  exportJson();
  Revert();
  if (isEndReached()) {
    break;
  }
  incrementPointer();
}