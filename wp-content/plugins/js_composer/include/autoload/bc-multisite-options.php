<?php
if ( ! defined( 'ABSPATH' ) ) {
	die( '-1' );
}

add_action( 'vc_activation_hook', 'vc_bc_multisite_options', 9 );

/**
 * @param $networkWide
 */
function vc_bc_multisite_options( $networkWide ) {
	global $current_site;
	
	// Now we need to check BC with license keys
	$is_main_blog_activated = true;
	
	update_site_option( 'wpb_js_js_composer_purchase_code', true );
	
	update_site_option( 'vc_bc_options_called', true );
}
