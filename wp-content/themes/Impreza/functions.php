<?php defined( 'ABSPATH' ) OR die( 'This script cannot be accessed directly.' );

add_shortcode('seo-text', 'seo_text');
function seo_text($args){
  switch ($args['text_number']) {
  	case '0':
  		return get_field('text-seo-0-text');
  		break;

	case '0':
  		return get_field('text-seo-0-text');
  		break;

	case '1':
  		return get_field('text-seo-1-text');
  		break;  
  		
  	case '2':
  		return get_field('text-seo-2-text');
  		break; 	

	case '3':
  		return get_field('text-seo-3-text');
  		break; 	 

  	case '4':
  		return get_field('text-seo-4-text');
  		break; 

  	default:
  		return('error');
  		break;
	}
}



//admin page on other link

define('ADMIN_URL', 'welcome.php');
add_action('init', 'redirect_login_page');
add_filter('login_url', 'new_wp_login_url', 10, 3);
add_filter('logout_url', 'new_wp_logout_url', 10, 2);
add_filter('lostpassword_url', 'new_wp_lostpassword_url', 10, 2);


function redirect_login_page() {
  $page_viewed = $_SERVER['REQUEST_URI'];
  if (strpos($page_viewed, "wp-login.php") !== false || (is_admin() && !(current_user_can('administrator') ||  current_user_can('super admin')) && !(defined('DOING_AJAX') && DOING_AJAX)) ) {
    global $wp_query;
    $wp_query->set_404();
    status_header(404);
    get_template_part('404');
    exit; 
  }
}

function new_wp_login_url($redirect = '', $force_reauth = false) {
  $login_url = site_url(ADMIN_URL, 'login');
  if (!empty($redirect)) $login_url = add_query_arg('redirect_to', urlencode($redirect), $login_url);
  if ($force_reauth) $login_url = add_query_arg('reauth', '1', $login_url);
  return $login_url;
}

function new_wp_logout_url() {
  $args = array( 'action' => 'logout' );
  $logout_url = add_query_arg($args, site_url(ADMIN_URL, 'login'));
  $logout_url = wp_nonce_url( $logout_url, 'log-out' );
  return $logout_url;
}

function new_wp_lostpassword_url() {
  $args = array( 'action' => 'lostpassword' );
  $lostpassword_url = add_query_arg( $args, network_site_url(ADMIN_URL, 'login') );
  return $lostpassword_url;
}

//disctrict shortcodes 
//
// shortcodes added in header.php 

function field_shortcode_predl() {
	return get_field('district-predl');
}
function field_shortcode_im() {
	return get_field('district-im');
}
function field_shortcode_rod() {
	return get_field('district-rod');
}
function field_shortcode_po() {
	return get_field('district-po');
}

//shortcodes for text group (ACF)

add_shortcode( 'price-table-heading', 'field_price_table_heading' );

function field_price_table_heading() {
	return get_field('price-table-heading');
}

add_shortcode( 'price-table-text', 'field_price_table_text' );

function field_price_table_text() {
	return get_field('price-table-text');
}

// heading for 0 block

add_shortcode( 'text-seo-0-heading', 'field_text_seo_0_heading' );

function field_text_seo_0_heading() {
	return get_field('text-seo-0-heading');
}


//shortcode rand values

add_shortcode( 'rand-value', 'random_value' );

function random_value( $args ){
	 return mt_rand($args['val_1'], $args['val_2']);
}


//assets

add_action('wp_enqueue_scripts', 'add_assets');

function add_assets() {

	wp_deregister_script( 'jquery-core' );

	wp_register_script( 'jquery-core', '//ajax.googleapis.com/ajax/libs/jquery/1.9.0/jquery.min.js');

	wp_enqueue_script( 'jquery' );	

	wp_enqueue_script('vue.js', 'https://cdn.jsdelivr.net/npm/vue/dist/vue.js', array(), '1.0.0', true );

	wp_enqueue_script('calc-common', get_template_directory_uri() . '/js/common.js', array(), '1.0.0', true );
	
	wp_enqueue_script('map', get_template_directory_uri() . '/js/map.js', array(), '1.0.0', true );

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
