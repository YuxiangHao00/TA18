<?php
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
        width: 150px;
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
    <?php
    return ob_get_clean();
}
add_shortcode('traffic_accident_heatmap', 'traffic_accident_heatmap_shortcode');
