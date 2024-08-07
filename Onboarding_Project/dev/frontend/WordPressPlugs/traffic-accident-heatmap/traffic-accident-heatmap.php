<?php
/*
Plugin Name: Traffic Accident Heatmap
Description: Displays a heatmap of traffic accidents in Melbourne
Version: 1.6
Author: YuxiangHao
*/

// Enqueue necessary scripts and styles
require_once plugin_dir_path(__FILE__) . 'tacm_enqueue_scripts.php';

// Shortcode function
require_once plugin_dir_path(__FILE__) . 'tacm_shortcode.php';
?>
