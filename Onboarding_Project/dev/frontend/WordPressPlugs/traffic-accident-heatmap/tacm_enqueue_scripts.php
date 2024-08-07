<?php
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
    wp_enqueue_script('tacm-functions-js', plugin_dir_url(__FILE__) . 'js/tacm_functions.js', array('leaflet-js', 'leaflet-heat-js', 'markercluster-js', 'flatpickr-js'), null, true);
}
add_action('wp_enqueue_scripts', 'tacm_enqueue_scripts');
