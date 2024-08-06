<?php
/*
Plugin Name: Traffic Accident Heatmap
Description: Displays a heatmap of traffic accidents in Melbourne
Version: 1.3
Author: YuxiangHao
*/

// Enqueue necessary scripts and styles
function tacm_enqueue_scripts() {
    wp_enqueue_style('leaflet-css', 'https://unpkg.com/leaflet/dist/leaflet.css');
    wp_enqueue_style('markercluster-css', 'https://unpkg.com/leaflet.markercluster/dist/MarkerCluster.css');
    wp_enqueue_style('markercluster-default-css', 'https://unpkg.com/leaflet.markercluster/dist/MarkerCluster.Default.css');
    wp_enqueue_style('flatpickr-css', 'https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css');

    wp_enqueue_script('leaflet-js', 'https://unpkg.com/leaflet/dist/leaflet.js', array(), null, true);
    wp_enqueue_script('leaflet-heat-js', 'https://unpkg.com/leaflet.heat/dist/leaflet-heat.js', array('leaflet-js'), null, true);
    wp_enqueue_script('markercluster-js', 'https://unpkg.com/leaflet.markercluster/dist/leaflet.markercluster.js', array('leaflet-js'), null, true);
    wp_enqueue_script('flatpickr-js', 'https://cdn.jsdelivr.net/npm/flatpickr', array(), null, true);
    wp_enqueue_script('heatmap-data-js', 'https://ta18.org/wp-content/uploads/2024/08/heatmap_data.js', array(), null, true);
}
add_action('wp_enqueue_scripts', 'tacm_enqueue_scripts');

// Shortcode function
function traffic_accident_heatmap_shortcode() {
    ob_start();
    ?>
    <style>
    #map {
        height: 600px;
        width: 100%;
        max-width: 100%;
        margin: 0 auto;
    }
    .legend {
        line-height: 18px;
        color: #555;
        background: white;
        padding: 6px 8px;
        box-shadow: 0 0 15px rgba(0,0,0,0.2);
        border-radius: 5px;
    }
    .legend i {
        width: 18px;
        height: 18px;
        float: left;
        margin-right: 8px;
        opacity: 0.7;
    }
    .filter-container {
        margin-bottom: 10px;
        display: flex;
        align-items: center;
    }
    .filter-container label, .filter-container input, .filter-container button {
        margin-right: 10px;
    }
    .filter-container input {
        width: 150px; /* 调整输入框的宽度 */
    }
    </style>

    <div class="filter-container">
        <label for="start-date">Start Date:</label>
        <input type="text" id="start-date" name="start-date">
        <label for="end-date">End Date:</label>
        <input type="text" id="end-date" name="end-date">
        <button onclick="filterAccidents()">Filter</button>
        <button onclick="resetFilters()">Reset Date</button>
    </div>
    <div id="map"></div>

    <script>
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

            // Initialize flatpickr with English locale
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

            var heatLayer = L.heatLayer(accidents_with_details.map(function(p) {
                return [p[3], p[4], 1]; // 使用纬度，经度和强度
            }), {
                radius: 25,
                gradient: {
                    0.2: '#00FF00',  // 绿色
                    0.4: '#ADFF2F',  // 黄绿色
                    0.6: '#FFFF00',  // 黄色
                    0.8: '#FFA500',  // 橙色
                    1.0: '#FF0000'   // 红色
                }
            }).addTo(map);

            // 创建Marker Cluster组
            var markers = L.markerClusterGroup();

            // 创建自定义图标
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
                    return [p[3], p[4], 1]; // 使用纬度，经度和强度
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
                if (map.getZoom() > 17) { // 在缩放级别大于17时显示标记
                    if (!map.hasLayer(markers)) {
                        map.addLayer(markers);
                    }
                    filterAccidents();
                } else {
                    if (map.hasLayer(markers)) {
                        map.removeLayer(markers);
                    }
                    // 更新热力图以显示所有数据
                    updateHeatmap(accidents_with_details);
                }
            }

            map.on('zoomend', checkZoomAndUpdateMarkers);
            map.on('moveend', function() {
                if (map.getZoom() > 17) {
                    filterAccidents();
                }
            });

            // 初始化热力图
            updateHeatmap(accidents_with_details);

            // 添加图例
            var legend = L.control({position: 'bottomright'});

            legend.onAdd = function (map) {
                var div = L.DomUtil.create('div', 'legend'),
                    grades = [0, 20, 40, 60, 80, 100],
                    labels = [];

                div.innerHTML += '<strong>Accident Density</strong><br>';
                for (var i = 0; i < grades.length - 1; i++) {
                    div.innerHTML +=
                        '<i style="background:' + getColor(grades[i + 1]) + '"></i> ' +
                        grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
                }

                return div;
            };

            legend.addTo(map);

            // 获取颜色函数
            function getColor(d) {
                return d > 80 ? '#FF0000' :
                       d > 60 ? '#FFA500' :
                       d > 40 ? '#FFFF00' :
                       d > 20 ? '#ADFF2F' :
                                '#00FF00';
            }

        } catch (error) {
            console.error("An error occurred:", error);
        }
    });
    </script>
    <?php
    return ob_get_clean();
}
add_shortcode('traffic_accident_heatmap', 'traffic_accident_heatmap_shortcode');
