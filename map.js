const map = L.map('exportMap', { zoomControl: false }).setView([20, 30], 2);

L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    // attribution: 'Map data &copy; OpenStreetMap contributors, Tiles &copy; CARTO',
    maxZoom: 18,
    className: 'map-tiles'
}).addTo(map);

map.flyTo([45, 70], 3, {
    animate: true,
    duration: 3 
});

const exportCountries = [
  { name: "Qazog'iston", geojsonName: "Kazakhstan", coords: [48.0196, 66.9237], info: "Export: Jeans, Denim rolls" },
  { name: "Russia", geojsonName: "Russia", coords: [61.5240, 105.3188], info: "Export: Jeans fabrics" },
  { name: "Tojikiston", geojsonName: "Tajikistan", coords: [38.8610, 71.2761], info: "Export: Tailored jeans" },
  { name: "Belarus", geojsonName: "Belarus", coords: [53.7098, 27.9534], info: "Export: Denim accessories" },
  { name: "Latvia", geojsonName: "Latvia", coords: [56.8796, 24.6032], info: "Export: Custom jeans" },
  { name: "Turkmenistan", geojsonName: "Turkmenistan", coords: [38.9697, 59.5563], info: "Export: Raw denim" },
  { name: "Qirg'iziston", geojsonName: "Kyrgyzstan", coords: [41.2044, 74.7661], info: "Export: Jeans pants" },
  { name: "Uzbekistan", geojsonName: "Uzbekistan", coords: [41.3775, 64.5853], info: "Our Headquarters" },
];

let highlightedLayer = null;
let geojsonData = null;

fetch('https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json')
    .then(res => res.json())
    .then(data => {
        geojsonData = data;
        exportCountries.forEach(country => {
            const icon = L.divIcon({
                className: '',
                html: '<div class="pulse-marker"></div>',
                iconSize: [15, 15],
                iconAnchor: [7.5, 7.5]
            });
    
            const marker = L.marker(country.coords, { icon }).addTo(map)
                .bindTooltip(`<strong>${country.name}</strong><br>${country.info}`, {
                    permanent: false,
                    direction: 'top',
                    offset: [0, -10]
                });
            
            marker.on('mouseover', function(e) {
                const countryFeature = geojsonData.features.find(f => f.properties.name === country.geojsonName);
                if (countryFeature) {
                    highlightedLayer = L.geoJSON(countryFeature, {
                        style: {
                            fillColor: "#ff4d4d",
                            weight: 1.5,
                            opacity: 1,
                            color: 'white',
                            fillOpacity: 0.4
                        }
                    }).addTo(map);
                }
            });

            marker.on('mouseout', function(e) {
                if (highlightedLayer) {
                    map.removeLayer(highlightedLayer);
                }
            });

            marker.on('click', function(e) {
                const countryFeature = geojsonData.features.find(f => f.properties.name === country.geojsonName);
                if (countryFeature) {
                     map.flyToBounds(L.geoJSON(countryFeature).getBounds(), { padding: [50, 50] });
                }
            });
        });
    });