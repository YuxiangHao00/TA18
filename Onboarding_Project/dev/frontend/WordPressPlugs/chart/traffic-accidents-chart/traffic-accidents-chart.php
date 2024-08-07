<?php
/*
Plugin Name: Traffic Accidents Chart
Description: Display traffic accidents data in a vertical bar chart
Version: 1.0
Author: YuxiangHao
*/

if (!defined('ABSPATH')) exit; // Exit if accessed directly

function traffic_accidents_chart_shortcode() {
    // Get CSV file URL
    $csv_url = plugins_url('data/merged_bicycle_accidents.csv', __FILE__);
    
    // Load Chart.js library
    wp_enqueue_script('chartjs', 'https://cdn.jsdelivr.net/npm/chart.js', array(), null, true);
    
    // Add custom JavaScript
    wp_enqueue_script('traffic-accidents-chart', plugins_url('js/traffic-accidents-chart.js', __FILE__), array('chartjs'), '1.0', true);
    
    // Pass CSV URL to JavaScript
    wp_localize_script('traffic-accidents-chart', 'chartData', array(
        'csvUrl' => $csv_url
    ));
    
    // Return chart container
    return '<canvas id="trafficAccidentsChart" width="400" height="200"></canvas>';
}
add_shortcode('traffic_accidents_chart', 'traffic_accidents_chart_shortcode');