<?php
function tacm_enqueue_scripts() {
    wp_enqueue_style('leaflet-css', 'https://unpkg.com/leaflet/dist/leaflet.css');
    wp_enqueue_style('flatpickr-css', 'https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css');

    wp_enqueue_script('leaflet-js', 'https://unpkg.com/leaflet/dist/leaflet.js', array(), null, true);
    wp_enqueue_script('leaflet-heat-js', 'https://unpkg.com/leaflet.heat/dist/leaflet-heat.js', array('leaflet-js'), null, true);
    wp_enqueue_script('flatpickr-js', 'https://cdn.jsdelivr.net/npm/flatpickr', array(), null, true);
    wp_enqueue_script('heatmap-data-js', 'http://13.239.109.179/wp-content/uploads/2024/08/heatmap_data.js', array(), null, true);
    wp_enqueue_script('tacm-functions-js', plugin_dir_url(__FILE__) . 'js/tacm_functions.js', array('leaflet-js', 'leaflet-heat-js', 'flatpickr-js', 'heatmap-data-js'), null, true);
}
add_action('wp_enqueue_scripts', 'tacm_enqueue_scripts');
?>
