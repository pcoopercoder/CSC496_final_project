/* global L */
// make the map
let map = L.map("mapid", {
  center: [41.878, -93.581543], 
  zoom: 7.3, 
});
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

let geojson;
let colors = ["red", "green", "blue", "yellow"];
let currDists = [[], [], [], []];
let countyIds = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22,
  23, 24, 25,
];
let unnassignedChunks = [...countyIds];
let assignedChunks = [];
let lock = false;

let currPops = [0, 0, 0, 0];
let currRPops = [0, 0,0 ,0];
let currDPops = [0, 0, 0,0];
let sadEmojis = [
  "😔",
  "😢",
  "😂🫵",
  "😐",
  "🤨",
  "🤓☝️",
  "🤔",
  "😬",
  "🫣",
  "😓",
  "🤢",
  "🤮",
  "🤧",
];
let happyEmojis = ["🙂", "🤗", "😊", "😁", "🤩", "😺", "🐻", "😏"];
let winEmoji = "🥳";

let allValMaps = [
  [
    [20, 22],
    [6, 15, 16],
    [7, 13, 14, 17, 18, 19, 21, 23],
    [1, 2, 3, 4, 5, 8, 9, 10, 11, 12, 24, 25],
  ],
  [
    [20, 22],
    [6, 15, 16],
    [8, 13, 14, 17, 18, 19, 21, 23],
    [1, 2, 3, 4, 5, 7, 9, 10, 11, 12, 24, 25],
  ],
  [
    [20, 22],
    [6, 15, 16],
    [12, 13, 14, 17, 18, 19, 21, 23],
    [1, 2, 3, 4, 5, 7, 8, 9, 10, 11, 24, 25],
  ],
  [
    [20, 22],
    [6, 15, 16],
    [1, 2, 3, 4, 10, 11, 12, 13, 25],
    [5, 7, 8, 9, 14, 17, 18, 19, 21, 23, 24],
  ],
  [
    [20, 22],
    [6, 15, 16],
    [5, 7, 14, 17, 18, 19, 21, 23, 25],
    [1, 2, 3, 4, 8, 9, 10, 11, 12, 13, 24],
  ],
  [
    [20, 22],
    [6, 15, 16],
    [7, 8, 14, 17, 18, 19, 21, 23, 25],
    [1, 2, 3, 4, 5, 9, 10, 11, 12, 13, 24],
  ],
  [
    [20, 22],
    [6, 15, 16],
    [7, 13, 14, 17, 18, 19, 21, 23, 24],
    [1, 2, 3, 4, 5, 8, 9, 10, 11, 12, 25],
  ],
  [
    [20, 22],
    [6, 15, 16],
    [7, 14, 17, 18, 19, 21, 23, 24, 25],
    [1, 2, 3, 4, 5, 8, 9, 10, 11, 12, 13],
  ],
  [
    [20, 22],
    [6, 15, 16],
    [8, 13, 14, 17, 18, 19, 21, 23, 24],
    [1, 2, 3, 4, 5, 7, 9, 10, 11, 12, 25],
  ],
  [
    [20, 22],
    [6, 15, 16],
    [9, 12, 13, 14, 17, 18, 19, 21, 23],
    [1, 2, 3, 4, 5, 7, 8, 10, 11, 24, 25],
  ],
  [
    [20, 22],
    [6, 15, 16],
    [12, 13, 14, 17, 18, 19, 21, 23, 24],
    [1, 2, 3, 4, 5, 7, 8, 9, 10, 11, 25],
  ],
  [
    [20, 22],
    [6, 15, 16],
    [1, 2, 3, 4, 8, 9, 10, 11, 12, 13],
    [5, 7, 14, 17, 18, 19, 21, 23, 24, 25],
  ],
  [
    [20, 22],
    [6, 15, 16],
    [1, 2, 3, 4, 9, 10, 11, 12, 13, 25],
    [5, 7, 8, 14, 17, 18, 19, 21, 23, 24],
  ],
  [
    [20, 22],
    [6, 15, 16],
    [1, 2, 3, 4, 10, 11, 12, 13, 24, 25],
    [5, 7, 8, 9, 14, 17, 18, 19, 21, 23],
  ],
  [
    [20, 22],
    [6, 15, 16],
    [1, 2, 3, 8, 9, 10, 11, 12, 13, 25],
    [4, 5, 7, 14, 17, 18, 19, 21, 23, 24],
  ],
  [
    [20, 22],
    [6, 15, 16],
    [1, 2, 3, 9, 10, 11, 12, 13, 24, 25],
    [4, 5, 7, 8, 14, 17, 18, 19, 21, 23],
  ],
  [
    [6, 15, 16],
    [9, 12, 22],
    [13, 14, 17, 18, 19, 20, 21, 23],
    [1, 2, 3, 4, 5, 7, 8, 10, 11, 24, 25],
  ],
  [
    [6, 15, 16],
    [11, 12, 22],
    [1, 2, 3, 4, 8, 9, 10, 13, 20],
    [5, 7, 14, 17, 18, 19, 21, 23, 24, 25],
  ],
  [
    [6, 15, 16],
    [11, 12, 22],
    [7, 14, 17, 18, 19, 21, 23, 24, 25],
    [1, 2, 3, 4, 5, 8, 9, 10, 13, 20],
  ],
  [
    [6, 15, 16],
    [11, 12, 22],
    [8, 9, 10, 13, 20, 21, 23, 24, 25],
    [1, 2, 3, 4, 5, 7, 14, 17, 18, 19],
  ],
  [
    [6, 15, 16],
    [11, 12, 22],
    [14, 17, 18, 19, 20, 21, 23, 24, 25],
    [1, 2, 3, 4, 5, 7, 8, 9, 10, 13],
  ],
  [
    [6, 15, 16],
    [12, 22, 23],
    [13, 14, 17, 18, 19, 20, 21],
    [1, 2, 3, 4, 5, 7, 8, 9, 10, 11, 24, 25],
  ],
  [
    [6, 15, 16],
    [12, 22, 24],
    [13, 14, 17, 18, 19, 20, 21, 23],
    [1, 2, 3, 4, 5, 7, 8, 9, 10, 11, 25],
  ],
  [
    [6, 15, 16],
    [12, 22, 24],
    [5, 7, 14, 17, 18, 19, 21, 23, 25],
    [1, 2, 3, 4, 8, 9, 10, 11, 13, 20],
  ],
  [
    [6, 15, 16],
    [12, 22, 24],
    [7, 14, 17, 18, 19, 20, 21, 23, 25],
    [1, 2, 3, 4, 5, 8, 9, 10, 11, 13],
  ],
  [
    [6, 15, 16],
    [20, 22, 23],
    [8, 13, 14, 17, 18, 19, 21],
    [1, 2, 3, 4, 5, 7, 9, 10, 11, 12, 24, 25],
  ],
  [
    [6, 15, 16],
    [20, 22, 23],
    [9, 12, 13, 14, 17, 18, 19, 21],
    [1, 2, 3, 4, 5, 7, 8, 10, 11, 24, 25],
  ],
  [
    [6, 15, 16],
    [20, 22, 23],
    [12, 13, 14, 17, 18, 19, 21, 24],
    [1, 2, 3, 4, 5, 7, 8, 9, 10, 11, 25],
  ],
  [
    [6, 15, 16],
    [20, 22, 23],
    [4, 5, 7, 8, 14, 17, 18, 19, 21],
    [1, 2, 3, 9, 10, 11, 12, 13, 24, 25],
  ],
  [
    [6, 15, 16],
    [20, 22, 24],
    [7, 13, 14, 17, 18, 19, 21, 23],
    [1, 2, 3, 4, 5, 8, 9, 10, 11, 12, 25],
  ],
  [
    [6, 15, 16],
    [20, 22, 24],
    [8, 13, 14, 17, 18, 19, 21, 23],
    [1, 2, 3, 4, 5, 7, 9, 10, 11, 12, 25],
  ],
  [
    [6, 15, 16],
    [20, 22, 24],
    [12, 13, 14, 17, 18, 19, 21, 23],
    [1, 2, 3, 4, 5, 7, 8, 9, 10, 11, 25],
  ],
  [
    [6, 15, 16],
    [20, 22, 24],
    [1, 2, 3, 4, 10, 11, 12, 13, 25],
    [5, 7, 8, 9, 14, 17, 18, 19, 21, 23],
  ],
  [
    [6, 15, 16],
    [20, 22, 24],
    [5, 7, 14, 17, 18, 19, 21, 23, 25],
    [1, 2, 3, 4, 8, 9, 10, 11, 12, 13],
  ],
  [
    [6, 15, 16],
    [21, 22, 23],
    [7, 13, 14, 17, 18, 19, 20],
    [1, 2, 3, 4, 5, 8, 9, 10, 11, 12, 24, 25],
  ],
  [
    [6, 15, 16],
    [21, 22, 23],
    [8, 13, 14, 17, 18, 19, 20],
    [1, 2, 3, 4, 5, 7, 9, 10, 11, 12, 24, 25],
  ],
  [
    [6, 15, 16],
    [21, 22, 23],
    [12, 13, 14, 17, 18, 19, 20],
    [1, 2, 3, 4, 5, 7, 8, 9, 10, 11, 24, 25],
  ],
  [
    [6, 15, 16],
    [21, 22, 23],
    [12, 13, 14, 17, 18, 19, 20, 24],
    [1, 2, 3, 4, 5, 7, 8, 9, 10, 11, 25],
  ],
  [
    [6, 15, 16],
    [21, 22, 23],
    [1, 2, 10, 11, 12, 13, 20, 24, 25],
    [3, 4, 5, 7, 8, 9, 14, 17, 18, 19],
  ],
  [
    [6, 15, 16],
    [21, 22, 23],
    [4, 5, 7, 8, 14, 17, 18, 19, 20],
    [1, 2, 3, 9, 10, 11, 12, 13, 24, 25],
  ],
  [
    [6, 15, 16],
    [21, 22, 23],
    [5, 7, 8, 9, 14, 17, 18, 19, 20],
    [1, 2, 3, 4, 10, 11, 12, 13, 24, 25],
  ],
  [
    [6, 15, 16],
    [21, 22, 23],
    [8, 9, 10, 11, 12, 13, 20, 24, 25],
    [1, 2, 3, 4, 5, 7, 14, 17, 18, 19],
  ],
  [
    [6, 15, 16],
    [9, 12, 22, 23],
    [13, 14, 17, 18, 19, 20, 21],
    [1, 2, 3, 4, 5, 7, 8, 10, 11, 24, 25],
  ],
  [
    [6, 15, 16],
    [11, 12, 22, 24],
    [14, 17, 18, 19, 20, 21, 23, 25],
    [1, 2, 3, 4, 5, 7, 8, 9, 10, 13],
  ],
  [
    [6, 15, 16],
    [11, 12, 22, 24],
    [1, 2, 3, 4, 8, 9, 10, 13, 20],
    [5, 7, 14, 17, 18, 19, 21, 23, 25],
  ],
  [
    [6, 15, 16],
    [12, 22, 23, 24],
    [13, 14, 17, 18, 19, 20, 21],
    [1, 2, 3, 4, 5, 7, 8, 9, 10, 11, 25],
  ],
  [
    [6, 15, 16],
    [19, 21, 22, 23],
    [9, 12, 13, 14, 17, 18, 20],
    [1, 2, 3, 4, 5, 7, 8, 10, 11, 24, 25],
  ],
  [
    [6, 15, 16],
    [19, 21, 22, 23],
    [12, 13, 14, 17, 18, 20, 24],
    [1, 2, 3, 4, 5, 7, 8, 9, 10, 11, 25],
  ],
  [
    [6, 15, 16],
    [19, 21, 22, 23],
    [4, 5, 7, 8, 14, 17, 18, 20],
    [1, 2, 3, 9, 10, 11, 12, 13, 24, 25],
  ],
  [
    [6, 15, 16],
    [21, 22, 23, 24],
    [7, 13, 14, 17, 18, 19, 20],
    [1, 2, 3, 4, 5, 8, 9, 10, 11, 12, 25],
  ],
  [
    [6, 15, 16],
    [21, 22, 23, 24],
    [8, 13, 14, 17, 18, 19, 20],
    [1, 2, 3, 4, 5, 7, 9, 10, 11, 12, 25],
  ],
  [
    [6, 15, 16],
    [21, 22, 23, 24],
    [12, 13, 14, 17, 18, 19, 20],
    [1, 2, 3, 4, 5, 7, 8, 9, 10, 11, 25],
  ],
  [
    [6, 15, 16],
    [21, 22, 23, 24],
    [1, 2, 10, 11, 12, 13, 20, 25],
    [3, 4, 5, 7, 8, 9, 14, 17, 18, 19],
  ],
  [
    [6, 15, 16],
    [21, 22, 23, 24],
    [4, 5, 7, 14, 17, 18, 19, 20],
    [1, 2, 3, 8, 9, 10, 11, 12, 13, 25],
  ],
  [
    [6, 15, 16],
    [21, 22, 23, 24],
    [5, 7, 8, 14, 17, 18, 19, 20],
    [1, 2, 3, 4, 9, 10, 11, 12, 13, 25],
  ],
  [
    [6, 15, 16],
    [21, 22, 23, 24],
    [8, 9, 10, 11, 12, 13, 20, 25],
    [1, 2, 3, 4, 5, 7, 14, 17, 18, 19],
  ],
  [
    [6, 15, 16],
    [21, 22, 23, 24],
    [1, 2, 3, 4, 10, 11, 12, 13, 25],
    [5, 7, 8, 9, 14, 17, 18, 19, 20],
  ],
  [
    [6, 15, 16],
    [21, 22, 23, 24],
    [1, 2, 3, 10, 11, 12, 13, 20, 25],
    [4, 5, 7, 8, 9, 14, 17, 18, 19],
  ],
  [
    [6, 15, 16],
    [21, 22, 23, 24],
    [1, 2, 9, 10, 11, 12, 13, 20, 25],
    [3, 4, 5, 7, 8, 14, 17, 18, 19],
  ],
  [
    [12, 22, 23],
    [7, 8, 9, 13, 14, 15],
    [16, 17, 18, 19, 20, 21],
    [1, 2, 3, 4, 5, 6, 10, 11, 24, 25],
  ],
  [
    [12, 22, 24],
    [7, 8, 9, 13, 14, 15],
    [16, 17, 18, 19, 20, 21, 23],
    [1, 2, 3, 4, 5, 6, 10, 11, 25],
  ],
  [
    [12, 22, 23, 24],
    [7, 8, 9, 13, 14, 15],
    [16, 17, 18, 19, 20, 21],
    [1, 2, 3, 4, 5, 6, 10, 11, 25],
  ],
];

let numPosMaps = 0;

let jsonStore;

function validMapIsPossible(chunkID, distID) {
  distID -= 1;
  var newValMaps = [];

  var alteredDist = currDists[distID].slice();
  alteredDist.push(chunkID);

  let val;

  for (var valMap of allValMaps) {
    val = false;
    //     check if one district of the val map matches the desired assignment
    var matchedDist;
    for (let d of valMap) {
      //     they match when the alteredDist is a subset of the given d
      if (alteredDist.every((element) => d.includes(element))) {
        val = true;
        matchedDist = [...d];
      }
    }

    if (val) {
      //       check that the other already set dists have no interesection with the matched true val map
      for (var indx = 0; indx < 4; indx += 1) {
        if (indx != distID) {
          var intersection = currDists[indx].filter((value) =>
            matchedDist.includes(value)
          );
          if (intersection.length > 0) {
            val = false;
            break;
          }
        }
      }
    }
    if (val) {
      newValMaps.push(valMap);
    }
  }

  if (newValMaps.length > 0) {
    allValMaps = newValMaps;
    currDists[distID].push(chunkID);
    return true;
  } else {
    return false;
  }
}

function getComputerMove() {
  var randChunk =
    unnassignedChunks[Math.floor(Math.random() * unnassignedChunks.length)];

  //   try the 4 dists iterativley (at least one assignement is garunteed to be valid)
  for (let distID = 0; distID < 4; distID++) {
    if (validMapIsPossible(randChunk, distID + 1)) {
      assignedChunks.push(randChunk);
      const index = unnassignedChunks.indexOf(randChunk);
      if (index > -1) {
        assignedChunks.push(randChunk);
        unnassignedChunks.splice(index, 1);
      }
      let l;
      for (l in jsonStore.features) {
        if (jsonStore.features[l].properties.chunkID == randChunk) {
          L.geoJSON(jsonStore.features[l], {
            style: function (feature) {
              return {
                color: colors[distID],
                fillColor: colors[distID],
                fillOpacity: 0.4,
              };
            },
          }).addTo(map);

          //     update district pop
          currPops[distID] += jsonStore.features[l].properties.pop;
          currRPops[distID] += jsonStore.features[l].properties.repubPop;
          currDPops[distID] += jsonStore.features[l].properties.demPop;
          let distId = distID + 1;
          let htmlDistId = "D" + distId.toString() + "pop";
          let element = document.getElementById(htmlDistId);
          element.innerHTML = (currPops[distID] + " | 🫏 " + currDPops[distID] + " | 🐘 " + currRPops[distID]);
          break;
        }
      }
      break;
    }
  }
}

function assignDistrict(e) {
  const layer = e.target;

  if (!assignedChunks.includes(layer.feature.properties.chunkID) && !lock) {
    var radios = document.getElementsByName("districtBox");
    var color;
    // get dist to assign to + color to display
    var i = 0;
    for (length = radios.length; i < length; i++) {
      if (radios[i].checked) {
        color = colors[i];
        break;
      }
    }
    let distId = i + 1;

    if (validMapIsPossible(layer.feature.properties.chunkID, distId)) {
      assignedChunks.push(layer.feature.properties.chunkID);
      const index = unnassignedChunks.indexOf(layer.feature.properties.chunkID);
      if (index > -1) {
        unnassignedChunks.splice(index, 1);
      }

      //     update district pop
      currPops[i] += layer.feature.properties.pop;
      currRPops[i] += layer.feature.properties.repubPop;
      currDPops[i] += layer.feature.properties.demPop;

      let htmlDistId = "D" + distId.toString() + "pop";
      let element = document.getElementById(htmlDistId);
      element.innerHTML = (currPops[i] + " | 🫏 " + currDPops[i] + " | 🐘 " + currRPops[i]);

      // update map
      layer.setStyle({ fillColor: color });
      layer.setStyle({ color: color });

      element = document.getElementById("possMaps");
      element.innerHTML = allValMaps.length;

      element = document.getElementById("valStatus");
      let randEmoji =
        happyEmojis[Math.floor(Math.random() * happyEmojis.length)];
      element.innerHTML = randEmoji + " nice assignment!";

      // randEmoji;
      lock = true;
      getComputerMove();
      lock = false;
    } else {
      let element = document.getElementById("valStatus");
      let randEmoji = sadEmojis[Math.floor(Math.random() * sadEmojis.length)];
      element.innerHTML =
        randEmoji + " that assignment won't<br>lead to a valid map";
    }
  }
}

// change style
function highlightFeature(e) {
  let layer = e.target; // highlight the actual feature that should be highlighted

  if (!assignedChunks.includes(layer.feature.properties.chunkID)) {
    layer.setStyle({
      weight: 3,
      color: "#000",
      fillOpacity: 0.3,
    });
  }
  let element = document.getElementById("popPop");
  let pop = layer.feature.properties.pop;
  element.innerHTML = pop;

  element = document.getElementById("popDemPop");
  pop = layer.feature.properties.demPop;
  element.innerHTML = pop;

  element = document.getElementById("popRepPop");
  pop = layer.feature.properties.repubPop;
  element.innerHTML = pop;
}

// reset to normal style
function resetHighlight(e) {
  let layer = e.target;

  if (!assignedChunks.includes(layer.feature.properties.chunkID)) {
    geojson.resetStyle(e.target);
    let element = document.getElementById("popPop");
    element.innerHTML = "";

    element = document.getElementById("popDemPop");
    element.innerHTML = "";

    element = document.getElementById("popRepPop");
    element.innerHTML = "";
  }
}

// attach the event handlers
function onEachFeature(feature, layer) {
  layer.on({
    click: assignDistrict,
    mouseover: highlightFeature, // a.k.a. hover
    mouseout: resetHighlight, // a.k.a. no longer hovering
  });
}

function parseLine(line) {
  // Remove the parentheses and split the line by comma
  const tuples = line.slice(2, -2).split("), (");
  // Parse each tuple and convert it into an array
  return tuples.map((tuple) => tuple.split(", ").map(Number));
}


// get the data
fetch("output.json")
  .then(function (response) {
    return response.json();
  })
  .then(function (json) {
    jsonStore = json;
    runGame(json);
  });

// once the data is loaded, this function takes over
function runGame(json) {
  geojson = L.geoJSON(json, {
    style: function (feature) {
      return {};
    },
    onEachFeature: onEachFeature, // call onEachFeature
  })
    .bindPopup(function (layer) {
      return layer.feature.properties.CountyName; // use the NAME property as the popup value
    })
    .addTo(map); // add it to the map

  var info = L.control();

  info.onAdd = function (map) {
    this._div = L.DomUtil.create("div", "info"); // create a div with a class "info"
    this.update();
    return this._div;
  };

  info.update = function (props) {
    this._div.innerHTML =
      '<p>Select a district:</p><input type="radio" id="d1" name="districtBox" value="d1" checked="checked"><label for="d1">District 1 </label><br><input type="radio" id="d2" name="districtBox" value="d2"><label for="d2">District 2</label><br><input type="radio" id="d3" name="districtBox" value="d3"><label for="d3">District 3</label><br><input type="radio" id="d4" name="districtBox" value="d4"><label for="d4">District 4</label><p id="D1pop">0</p><p id="D2pop">0</p><p id="D3pop">0</p><p id="D4pop">0</p><p>------<br>CHUNK INFO:<br><br>Population:</p><p id="popPop"><p> <p>🫏 Democrat Population:<p> <p id="popDemPop"><p><p>🐘 Republican Population:<p><p id = "popRepPop"> <p><p>------<br>STATUS:<br><br>Possible Maps:</p><p id="possMaps"><p> <p><p id="valStatus"><p> <p>';
  };

  info.addTo(map);
}
