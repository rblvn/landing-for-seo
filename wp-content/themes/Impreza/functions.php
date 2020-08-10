<?php defined( 'ABSPATH' ) OR die( 'This script cannot be accessed directly.' );

add_action('wp_enqueue_scripts', 'add_assets');


function add_assets() {
    
	wp_enqueue_script('calc-common', get_template_directory_uri() . '/js/common.js', array(), '1.0.0', true );
     wp_enqueue_script('calc-data', get_template_directory_uri() . '/js/calc.data.js', array(), '1.0.0', true );
     wp_enqueue_script('calc-main', get_template_directory_uri() . '/js/calc.js', array(), '1.0.0', true );
     wp_enqueue_script('disclaim-element.js', get_template_directory_uri() . '/js/disclaim-element.js', array(), '1.0.0', true );
     wp_enqueue_script('graph-calc.js', get_template_directory_uri() . '/js/graph-calc.js', array(), '1.0.0', true );
    wp_enqueue_script('vue.js', 'https://cdn.jsdelivr.net/npm/vue/dist/vue.js', array(), '1.0.0', true );
    wp_enqueue_style('jquery.modal.min.css', 'https://cdnjs.cloudflare.com/ajax/libs/jquery-modal/0.9.1/jquery.modal.min.css');
    wp_enqueue_script('main.js', get_template_directory_uri() . '/js/main.js', array(), '1.0.0', true );

wp_register_script( 'jquery', 'http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js');
	wp_enqueue_script( 'jquery' );


}

/**
 * Theme functions and definitions
 */

if ( ! defined( 'US_ACTIVATION_THEMENAME' ) ) {
	define( 'US_ACTIVATION_THEMENAME', 'Impreza' );
}
$us_theme = wp_get_theme();
if ( ! defined( 'US_THEMENAME' ) ) {
		define( 'US_THEMENAME', $us_theme->get( 'Name' ) );
	}

update_option( 'us_license_activated', 1 );
delete_option( 'us_license_dev_activated' );
update_option( 'us_license_secret', 'nulled' );
delete_transient( 'us_update_addons_data_' . US_THEMENAME );
 
Register_nav_menus( array(
  'vertical_demo' => esc_html__( 'Vertical Menu Demo', 'wp-mega-menu-pro' ),
 ));


global $us_theme_supports;
$us_theme_supports = array(
	'plugins' => array(
		'js_composer' => 'plugins-support/js_composer/js_composer.php',
		'Ultimate_VC_Addons' => 'plugins-support/Ultimate_VC_Addons.php',
		'revslider' => 'plugins-support/revslider.php',
		'contact-form-7' => NULL,
		'gravityforms' => 'plugins-support/gravityforms.php',
		'woocommerce' => 'plugins-support/woocommerce.php',
		'wpml' => 'plugins-support/wpml.php',
		'bbpress' => 'plugins-support/bbpress.php',
		'tablepress' => 'plugins-support/tablepress.php',
		'the-events-calendar' => 'plugins-support/the_events_calendar.php',
		'tiny_mce' => 'plugins-support/tiny_mce.php',
		'yoast' => 'plugins-support/yoast.php',
		'post_views_counter' => 'plugins-support/post_views_counter.php',
	),
);

require dirname( __FILE__ ) . '/common/framework.php';
