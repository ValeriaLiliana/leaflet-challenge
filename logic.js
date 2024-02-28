// Create the map
var map = L.map("map").setView([0, 0], 2);

// Add the tile layer (you can use any tile provider you prefer)
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
  maxZoom: 18,
}).addTo(map);

// Load the earthquake GeoJSON data
fetch("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson")
  .then((response) => response.json())
  .then((data) => {
    // Add the GeoJSON layer to the map
    L.geoJSON(data, {
      pointToLayer: function (feature, latlng) {
        var mag = feature.properties.mag;
        var radius = Math.pow(mag, 1.5); // Adjust the scale factor as needed
        var depth = latlng.alt;
        var color;

        if (depth <= 10) {
          color = "#a3f600";
        } else if (depth <= 30) {
          color = "#dcf400";
        } else if (depth <= 50) {
          color = "#f7db11";
        } else if (depth <= 70) {
          color = "#fdb72a";
        } else if (depth <= 90) {
          color = "#fca35d";
        } else {
          color = "#ff5f65";
        }

        return L.circleMarker(latlng, {
          radius: radius,
          fillColor: color,
          color: "#777777",
          weight: 1,
          opacity: 1,
          fillOpacity: 0.8,
        }).bindPopup(
          "<strong>Magnitude: " +
            mag +
            "</strong><br>" +
            "Location: " +
            feature.properties.place +
            "<br>" +
            "Time: " +
            new Date(feature.properties.time).toLocaleString("en-US", { timeZone: "America/New_York" }) +
            "<br>" +
            '<a href="' +
            feature.properties.url +
            '" target="_blank">More details</a>'
        );
      },
    }).addTo(map);
  });

// Create the legend control
var legend = L.control({ position: "bottomright" });

// Define the legend content
legend.onAdd = function (map) {
  var div = L.DomUtil.create("div", "legend");
  var labels = ["-10 - 10", "10 - 30", "30 - 50", "50 - 70", "70 - 90", "90+"];
  var colors = ["#a3f600", "#dcf400", "#f7db11", "#fdb72a", "#fca35d", "#ff5f65"];

  for (var i = 0; i < labels.length; i++) {
    div.innerHTML += `<tr style="padding:0; margin: 0"><td style="padding:0; margin:0;"><span style="background-color: ${colors[i]}">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>&nbsp;</td><td>${labels[i]}</td></tr><br>`;
  }
  div.innerHTML = "<table>" + div.innerHTML + "</table>";
  return div;
};

// Add the legend to the map
legend.addTo(map);

// Fit the map bounds to the GeoJSON layer
//map.fitBounds(geojsonLayer.getBounds());
