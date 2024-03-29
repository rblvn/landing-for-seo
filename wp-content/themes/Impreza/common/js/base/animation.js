
// Animation of elements appearance
jQuery( function( $ ) {
	"use strict";

	$( '.animate_fade, .animate_afc, .animate_afl, .animate_afr, .animate_aft, .animate_afb, .animate_wfc, ' +
		'.animate_hfc, .animate_rfc, .animate_rfl, .animate_rfr' ).each( function() {
		$us.waypoints.add( $( this ), '15%', function( $elm ) {
			if ( ! $elm.hasClass( 'animate_start' ) ) {
				$us.timeout( function() {
					$elm.addClass( 'animate_start' );
				}, 20 );
			}
		} );
	} );
	$( '.wpb_animate_when_almost_visible' ).each( function() {
		$us.waypoints.add( $( this ), '15%', function( $elm ) {
			if ( ! $elm.hasClass( 'wpb_start_animation' ) ) {
				$us.timeout( function() {
					$elm.addClass( 'wpb_start_animation' );
				}, 20 );
			}
		} );
	} );
} );
