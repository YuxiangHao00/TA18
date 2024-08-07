<?php
/*
Plugin Name: Traffic Accidents Chart
Description: Display traffic accidents data in a vertical bar chart with date filtering and sorting options
Version: 1.2
Author: YuxiangHao
*/

if (!defined('ABSPATH')) exit; // Exit if accessed directly

function traffic_accidents_chart_shortcode() {
    // Get CSV file URL from the plugin directory
    $csv_url = plugins_url('data/merged_bicycle_accidents.csv', __FILE__);
    
    // Load Chart.js library
    wp_enqueue_script('chartjs', 'https://cdn.jsdelivr.net/npm/chart.js', array(), null, true);
    
    // Add custom JavaScript
    wp_enqueue_script('traffic-accidents-chart', plugins_url('js/traffic-accidents-chart.js', __FILE__), array('chartjs'), '1.2', true);
    
    // Pass CSV URL to JavaScript
    wp_localize_script('traffic-accidents-chart', 'chartData', array(
        'csvUrl' => $csv_url
    ));
    
    // Return chart container and control elements
    return '
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
        <div>
            <input type="date" id="startDate" style="width: 130px;">
            <input type="date" id="endDate" style="width: 130px;">
            <button id="filterDates">Filter</button>
            <button id="resetDates">Reset</button>
        </div>
        <select id="sortOrder" style="width: 150px;">
            <option value="desc">Highest to Lowest</option>
            <option value="asc">Lowest to Highest</option>
        </select>
    </div>
    <div style="height: 500px; overflow-y: scroll;">
        <canvas id="trafficAccidentsChart" width="400" height="1000"></canvas>
    </div>';
}
add_shortcode('traffic_accidents_chart', 'traffic_accidents_chart_shortcode');