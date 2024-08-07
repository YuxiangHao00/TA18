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

        flatpickr("#start-date", {
            dateFormat: "Y-m-d",
            locale: "en"
        });

        flatpickr("#end-date", {
            dateFormat: "Y-m-d",
            locale: "en"
        });

        var map = L.map('map').setView([-37.8136, 144.9631], 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        setTimeout(function() {
            map.invalidateSize();
        }, 100);

        // Load GeoJSON and add to map
        fetch('path_to_your_geojson_file.geojson')
            .then(response => response.json())
            .then(geojsonData => {
                L.geoJSON(geojsonData, {
                    style: function(feature) {
                        return {
                            fillColor: getRiskColor(feature.properties.riskLevel),
                            weight: 2,
                            opacity: 1,
                            color: 'white',
                            dashArray: '3',
                            fillOpacity: 0.7
                        };
                    }
                }).addTo(map);
            });

        function getRiskColor(d) {
            return d > 80 ? '#FF0000' :
                   d > 60 ? '#FFA500' :
                   d > 40 ? '#FFFF00' :
                   d > 20 ? '#ADFF2F' :
                            '#00FF00';
        }

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

        var markers = L.markerClusterGroup();

        var accidentIcon = L.icon({
            iconUrl: 'https://ta18.org/wp-content/uploads/2024/08/accident_icon_2.png',
            iconSize: [20, 20],
            iconAnchor: [10, 10],
            popupAnchor: [0, -10],
            shadowUrl: null,
            shadowSize: null,
            shadowAnchor: null
        });

        function updateMarkers(filteredData) {
            markers.clearLayers();
            var bounds = map.getBounds();
            filteredData.forEach(function(p) {
                var lat = p[3];
                var lng = p[4];
                if (bounds.contains([lat, lng])) {
                    var marker = L.marker([lat, lng], { icon: accidentIcon });
                    marker.bindPopup("<b>Date:</b> " + p[1] + "<br><b>Description:</b> " + p[2]);
                    markers.addLayer(marker);
                }
            });
        }

        function updateHeatmap(filteredData) {
            heatLayer.setLatLngs(filteredData.map(function(p) {
                return [p[3], p[4], 1];
            }));
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

            if (map.getZoom() > 17) {
                updateMarkers(filteredData);
            }
            updateHeatmap(filteredData);
        }

        window.resetFilters = function() {
            document.getElementById('start-date').value = '';
            document.getElementById('end-date').value = '';
            if (map.getZoom() > 17) {
                updateMarkers(accidents_with_details);
            }
            updateHeatmap(accidents_with_details);
        }

        function checkZoomAndUpdateMarkers() {
            if (map.getZoom() > 17) {
                if (!map.hasLayer(markers)) {
                    map.addLayer(markers);
                }
                filterAccidents();
            } else {
                if (map.hasLayer(markers)) {
                    map.removeLayer(markers);
                }
                updateHeatmap(accidents_with_details);
            }
        }

        map.on('zoomend', checkZoomAndUpdateMarkers);
        map.on('moveend', function() {
            if (map.getZoom() > 17) {
                filterAccidents();
            }
        });

        updateHeatmap(accidents_with_details);

        var legend = L.control({position: 'bottomright'});

        legend.onAdd = function (map) {
            var div = L.DomUtil.create('div', 'legend'),
                grades = [0, 20, 40, 60, 80, 100],
                labels = [];

            div.innerHTML += '<strong>Accident Density</strong><br>';
            for (var i = 0; i < grades.length - 1; i++) {
                div.innerHTML +=
                    '<i style="background:' + getRiskColor(grades[i + 1]) + '"></i> ' +
                    grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
            }

            return div;
        };

        legend.addTo(map);

    } catch (error) {
        console.error("An error occurred:", error);
    }
});
