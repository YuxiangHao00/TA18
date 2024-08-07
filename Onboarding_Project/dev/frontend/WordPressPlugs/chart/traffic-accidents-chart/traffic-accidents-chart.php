<?php
/*
Plugin Name: Traffic Accidents Chart
Description: Display traffic accidents data in a vertical bar chart with date filtering and sorting options
Version: 1.4
Author: YuxiangHao
*/

if (!defined('ABSPATH')) exit; // Exit if accessed directly

function traffic_accidents_chart_shortcode() {
    $csv_url = plugins_url('data/merged_bicycle_accidents.csv', __FILE__);
    
    wp_enqueue_script('chartjs', 'https://cdn.jsdelivr.net/npm/chart.js', array(), null, true);
    wp_enqueue_script('traffic-accidents-chart', plugins_url('js/traffic-accidents-chart.js', __FILE__), array('chartjs'), '1.4', true);
    
    wp_localize_script('traffic-accidents-chart', 'chartData', array(
        'csvUrl' => $csv_url
    ));
    
    return '
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
        <div>
            <input type="date" id="startDate" style="width: 130px;" placeholder="Start Date">
            <input type="date" id="endDate" style="width: 130px;" placeholder="End Date">
            <button id="filterDates">Filter</button>
            <button id="resetDates">Reset</button>
        </div>
        <select id="sortOrder" style="width: 150px;">
            <option value="desc">Highest to Lowest</option>
            <option value="asc">Lowest to Highest</option>
        </select>
    </div>
    <div style="display: flex;">
        <div id="chartContainer" style="height: 500px; width: calc(100% - 20px); overflow-y: hidden;">
            <canvas id="trafficAccidentsChart" width="400" height="1000"></canvas>
        </div>
        <div id="scrollbar" style="width: 20px; height: 500px; background: #ddd; cursor: pointer;">
            <div id="scrollHandle" style="width: 100%; height: 20%; background: #888;"></div>
        </div>
    </div>';
}
add_shortcode('traffic_accidents_chart', 'traffic_accidents_chart_shortcode');