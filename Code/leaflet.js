let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";
d3.json(queryUrl).then(function(data) {
    createFeatures(data.features);
});

function chooseColor(mag) {
    if (mag < 0.5 ) return "green";
    else if (mag < 1) return "greenyellow";
    else if (mag < 1.5) return "yellow";
    else if (mag <2) return "orange";
    else if (mag < 3) return "orangered";
    else if (mag < 4) return "red";
    else return "purple";
}

function createFeatures(earthquakeData) {
    function onEachFeature(feature, layer) {
        layer.bindPopup(`<h3>Location: ${feature.properties.place}</h3><hr><p>Date: ${new Date(feature.properties.time)}</p><p>Magnitude: ${feature.properties.mag}</p><p>Depth: ${feature.geometry.coordinates[2]}</p>`);
        
    }

    let earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: onEachFeature,
        pointToLayer: function(feature, latlng) {
            let markers = {
                radius: feature.properties.mag * 20000,
                fillColor: chooseColor(feature.geometry.coordinates[2]),
                fillOpacity: 0.5,
                color: "black",
                weight: 0.5
            }
            return L.circle(latlng, markers);
        }
    });
    createMap(earthquakes);
}

function createMap(earthquakes) {
    let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});
    let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
  });

  let baseMaps = {
    "Street Map": street,
    "Topo Map": topo
  };

  let overlayMaps = {
    "Earthquakes": earthquakes
  };

  let myMap = L.map("map", {
    center:[37.09, -95.71],
    zoom: 5,
    layers: [street, earthquakes]
  });

  let legend = L.control({position: "bottomright"});
  legend.onAdd = function() {
    let div = L.DomUtil.create("div", "info legend"),
    mag = [0.5, 1, 1.5, 2, 3, 4];
    div.innerHTML += "<h3 style='text-align: center'>Mag</h3>"
    for (let i = 0; i < mag.length; i++) {
        div.innerHTML +=
        '<i style="background:' + chooseColor(mag[i] + 1) + '"></i> ' + mag[i] + (mag[i + 1] ? '&ndash;' + mag[i + 1] + '<br>' : '+');
      
    }
    return div;
  };
  legend.addTo(myMap)

  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap)
};