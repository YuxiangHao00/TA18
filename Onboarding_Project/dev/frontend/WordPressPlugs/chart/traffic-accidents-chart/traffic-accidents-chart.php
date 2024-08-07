<?php
/*
Plugin Name: Traffic Accidents Chart
Description: Display traffic accidents data in a vertical bar chart with date filtering and sorting options
Version: 1.6
Author: YuxiangHao
*/

if (!defined('ABSPATH')) exit;

function traffic_accidents_chart_shortcode() {
    $csv_url = plugins_url('data/merged_bicycle_accidents.csv', __FILE__);
    
    wp_enqueue_script('chartjs', 'https://cdn.jsdelivr.net/npm/chart.js', array(), null, true);
    wp_enqueue_script('traffic-accidents-chart', plugins_url('js/traffic-accidents-chart.js', __FILE__), array('chartjs'), '1.6', true);
    
    wp_localize_script('traffic-accidents-chart', 'chartData', array(
        'csvUrl' => $csv_url
    ));
    
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
    <div id="chartContainer" style="height: 500px; width: 100%; overflow-y: hidden;">
        <canvas id="trafficAccidentsChart" width="400" height="1000"></canvas>
    </div>';
}
add_shortcode('traffic_accidents_chart', 'traffic_accidents_chart_shortcode');