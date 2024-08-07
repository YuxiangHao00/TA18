document.addEventListener('DOMContentLoaded', function() {
    try {
        if (!document.getElementById('map')) {
            console.error("Map container not found!");
            return;
        }

        if (typeof accidents_with_details === 'undefined' || !accidents_with_details || accidents_with_details.length === 0) {
            console.error("No accident data available!");
            return;
        }

        flatpickr("#start-date", { dateFormat: "Y-m-d", locale: "en" });
        flatpickr("#end-date", { dateFormat: "Y-m-d", locale: "en" });

        var map = L.map('map').setView([-37.8136, 144.9631], 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        setTimeout(function() { map.invalidateSize(); }, 100);

        var heatLayer = L.heatLayer(accidents_with_details.map(function(p) {
            return [p[3], p[4], 1];
        }), {
            radius: 25,
            gradient: {
                0.2: '#00FF00',
                0.4: '#ADFF2F',
                0.6: '#FFFF00',
                0.8: '#FFA500',
                1.0: '#FF0000'
            }
        }).addTo(map);

        fetch('http://13.239.109.179/wp-content/uploads/2024/08/melbourne_zones.geojson')
            .then(function(response) {
                return response.json();
            })
            .then(function(data) {
                L.geoJSON(data, {
                    style: function(feature) {
                        var accidentCount = getAccidentCountForZone(feature);
                        return {
                            fillColor: getColor(accidentCount),
                            weight: 2,
                            opacity: 1,
                            color: 'white',
                            dashArray: '3',
                            fillOpacity: 0.7
                        };
                    }
                }).addTo(map);
            })
            .catch(function(error) {
                console.error('Error loading the GeoJSON file:', error);
            });

        function getAccidentCountForZone(feature) {
            var bounds = L.geoJSON(feature).getBounds();
            var count = 0;
            accidents_with_details.forEach(function(p) {
                var latlng = L.latLng(p[3], p[4]);
                if (bounds.contains(latlng)) {
                    count++;
                }
            });
            return count;
        }

        function getColor(d) {
            return d > 100 ? '#800026' :
                   d > 50  ? '#BD0026' :
                   d > 20  ? '#E31A1C' :
                   d > 10  ? '#FC4E2A' :
                   d > 5   ? '#FD8D3C' :
                   d > 1   ? '#FEB24C' :
                            '#FFEDA0';
        }

        window.filterAccidents = function() {
            var startDate = document.getElementById('start-date').value;
            var endDate = document.getElementById('end-date').value;
            var filteredData = accidents_with_details;

            if (startDate && endDate) {
                filteredData = accidents_with_details.filter(function(p) {
                    var accidentDate = new Date(p[1]);
                    return accidentDate >= new Date(startDate) && accidentDate <= new Date(endDate);
                });
            }

            heatLayer.setLatLngs(filteredData.map(function(p) {
                return [p[3], p[4], 1];
            }));
        }

        window.resetFilters = function() {
            document.getElementById('start-date').value = '';
            document.getElementById('end-date').value = '';
            heatLayer.setLatLngs(accidents_with_details.map(function(p) {
                return [p[3], p[4], 1];
            }));
        }

    } catch (error) {
        console.error("An error occurred:", error);
    }
});
