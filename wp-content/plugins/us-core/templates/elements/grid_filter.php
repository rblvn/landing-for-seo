<?php defined( 'ABSPATH' ) OR die( 'This script cannot be accessed directly.' );

/**
 * Shortcode: us_grid_filter
 *
 * Dev note: if you want to change some of the default values or acceptable attributes, overload the element config.
 */

if ( ! empty( $filter_items ) ) {
	$filter_items = json_decode( urldecode( $filter_items ), TRUE );
} else {
	return;
}

$_atts['class'] = 'w-filter state_desktop';
$_atts['class'] .= ' layout_' . $layout;
$_atts['class'] .= ' items_' . count( $filter_items );

if ( $layout == 'hor' ) {
	$_atts['class'] .= ' style_' . $style;
	$_atts['class'] .= ' align_' . $align;
	$_atts['class'] .= ' show_on_' . $values_drop;
	if ( empty( $show_item_title ) ) {
		$_atts['class'] .= ' hide_item_title';
	}
}

if ( ! empty( $el_class ) ) {
	$_atts['class'] .= ' ' . $el_class;
}
if ( ! empty( $el_id ) ) {
	$_atts['id'] = $el_id;
}
$_atts['action'] = '';
$_atts['onsubmit'] = 'return false;';

// Export settings to grid-filter.js
$json_data = array(
	'filterPrefix' => US_GRID_FILTER_PREFIX,
	'layout' => $layout,
	'mobileWidth' => intval( $mobile_width ),
);

// Message when Grid not found
$json_data['gridNotFoundMessage'] = 'Nothing to filter. Add suitable Grid to this page.';

// Get filter taxonomies
$filter_taxonomies = us_get_filter_taxonomies( US_GRID_FILTER_PREFIX );

$output = '<form ' . us_implode_atts( $_atts ) . us_pass_data_to_js( $json_data ) . '>';

// Add mobile related control and styles
if ( ! empty( $mobile_width ) ) {
	$style  = '@media( max-width:' . strip_tags( $mobile_width ) . ') {';
	$style .= '.w-filter.state_desktop .w-filter-list,';
	$style .= '.w-filter-item-title > span { display: none; }';
	$style .= '.w-filter-opener { display: inline-block; }';
	$style .= '}';

	$output .= '<style>' . us_minify_css( $style ) . '</style>';
	$output .= '<a class="w-filter-opener" href="javascript:void(0);">' . strip_tags( __( 'Filters', 'us' ) ) . '</a>';
}

$output .= '<div class="w-filter-list">';

if ( ! empty( $mobile_width ) ) {
	$output .= '<h5 class="w-filter-list-title">' . strip_tags( __( 'Filters', 'us' ) ) . '</h5>';
	$output .= '<a class="w-filter-list-closer" href="javascript:void(0);" title="' . esc_attr( us_translate( 'Close' ) ) . '"></a>';
}

/**
 * Sorts the order of terms
 *
 * @param array $terms
 * @param int $parent
 * @return array
 */
$func_sort_terms = function( &$terms, $parent = 0 ) use ( &$func_sort_terms ) {
	$result = array();
	foreach ( $terms as $i => $term ) {
		if ( $term->parent == $parent ) {
			$result[] = $term;
			unset( $terms[$i] );
			foreach ( $terms as $item ) {
				if ( $item->parent AND $item->parent === $term->term_id ) {
					$result = array_merge( $result, $func_sort_terms( $terms, $term->term_id ) );
				}
			}
		}
	}
	return $result;
};

foreach ( $filter_items as $filter_item ) {

	if ( empty( $filter_item['source'] ) ) {
		continue;
	}

	extract( array_combine(
		array( 'item_type', 'item_name' ),
		explode( '|' , $filter_item['source'], 2 )
	) );

	$ui_type = $filter_item['ui_type'];
	$item_values = $terms_parent = array();
	$taxonomy_obj = NULL;

	// TODO: add Title setting
	if ( ! empty( $filter_item['title'] ) ) {
		$item_title = $filter_item['title'];
	} else {
		$item_title = '';
	}

	// Check Taxonomies
	if ( $item_type === 'tax' ) {
		$taxonomy_obj = get_taxonomy( $item_name );

		// Define Title as singular name of taxonomy
		if ( empty( $item_title ) AND $taxonomy_obj instanceof WP_Taxonomy ) {
			$item_title = $taxonomy_obj->labels->singular_name;
		}

		// Populate values with terms of taxonomy
		$item_values = get_terms( array(
			'taxonomy' => $item_name,
			'hide_empty' => TRUE,
		) );

		// The get_terms() might return an error or might be empty so skip further execution if it's the case
		if ( ! is_array( $item_values ) OR empty( $item_values ) ) {
			continue;
		}

		// Define parent terms to display terms hierarchy
		foreach ( $item_values as $term ) {
			if ( $term instanceof WP_Term ) {
				$terms_parent[ $term->term_id ] = $term->parent;
			}
		}

		// Sorts the terms with parents regarding hierarchy
		$item_values = $func_sort_terms( $item_values );

		// Check Custom Fields
	} elseif ( $item_type === 'cf' ) {

		if ( $item_name === '_price' AND ! class_exists( 'woocommerce' ) ) {
			continue;
		}

		// ACF
		if ( function_exists( 'acf_get_field' ) AND $acf_field = acf_get_field( $item_name ) ) {

			// Add a unique ID to the item name and source
			$filter_item['source'] .= '_' . $acf_field['ID'];
			$item_name .= '_' . $acf_field['ID'];

			// Define Title from ACF field
			if ( empty( $item_title ) ) {
				$item_title = $acf_field['label'];
			}

			// Populate values with relevant ACF fields values
			if ( in_array( $acf_field['type'], array( 'select', 'checkbox', 'radio' ) ) ) {
				$acf_name = us_arr_path( $acf_field, 'name', '' );

				$query_vars = array(
					'nopaging' => TRUE,
					'post_type' => array_keys( us_grid_available_taxonomies() ),
					'suppress_filters' => TRUE,
				);
				us_define_content_and_apply_grid_filters( $query_vars );

				foreach ( us_arr_path( $acf_field, 'choices', array() ) as $option_key => $option_name ) {

					// Receive posts only for the current field
					$query_vars['meta_query'] = array(
						array(
							'key' => $acf_name,
							'value' => sprintf( '^%s$|"%s"', $option_name, $option_name ),
							'compare' => 'RLIKE',
							'type' => 'CHAR',
						)
					);

					$item_values[] = ( object ) array(
						'name' => $option_name,
						'slug' => preg_replace( '/\s/', '_', strtolower( $option_key ) ),
						'parent' => 0,
						// TODO: Optimize the requests and get all the calculations in one request
						'count' =>  ( new WP_Query( $query_vars ) )->found_posts,
					);
				}
			}
		}

		// Add a title if it is not in the settings
		if ( empty( $item_title ) AND $item_name === '_price' ) {
			$item_title = us_translate( 'Price', 'woocommerce' );
		}

	} else {
		continue;
	}

	$item_atts = array(
		'class' => 'w-filter-item',
		'data-source' => $filter_item['source'],
		'data-ui_type' => $ui_type,
	);

	// Output filter items
	$output .= '<div ' . us_implode_atts( $item_atts ) . '>';
	$output .= '<a class="w-filter-item-title" href="javascript:void(0);">';
	$output .= strip_tags( $item_title );
	$output .= '<span></span></a>';

	// Output "Reset" filter item link
	$output .= '<a class="w-filter-item-reset" href="javascript:void(0);" title="' . us_translate( 'Reset' ) . '">';
	$output .= '<span>' . us_translate( 'Reset' ) . '</span>';
	$output .= '</a>';

	// Output filter item values
	$output .= '<div class="w-filter-item-values"' . us_prepare_inline_css( array( 'max-height' => $values_max_height ) ) . '>';

	// Checkboxes and Radio Buttons semantics
	if ( in_array( $ui_type, array( 'checkbox', 'radio' ) ) AND ! empty( $item_values ) ) {

		// Add "All" radio button
		if ( $ui_type == 'radio' AND ! empty( $filter_item['show_all_value'] ) ) {
			$selected_all_value = '';

			if (
				empty( $filter_taxonomies[ $filter_item['source'] ] )
				OR (
					! empty( $filter_taxonomies[ $filter_item['source'] ] )
					AND in_array( '*' /* All */ , $filter_taxonomies[ $filter_item['source'] ] )
				)
			) {
				$selected_all_value = ' selected';
			}

			$all_value_atts = array(
				'class' => 'screen-reader-text',
				'type' => 'radio',
				'value' => '*',
				'name' => sprintf( '%s_%s', US_GRID_FILTER_PREFIX, $item_name ),
			);

			$output .= '<a class="w-filter-item-value' . $selected_all_value . '" href="javascript:void(0);">';
			$output .= '<label>';
			$output .= '<input ' . us_implode_atts( $all_value_atts ) . checked( $selected_all_value, ' selected', FALSE ) . '>';
			$output .= '<span class="w-form-radio"></span>';
			$output .= '<span class="w-filter-item-value-label">' . __( 'All', 'us' ) . '</span>';
			$output .= '</label>';
			$output .= '</a>';
		}

		$item_values_counter = 0;

		foreach ( $item_values as $item_value ) {

			// Mark selected item values
			$selected_value = '';
			if (
				! empty ( $filter_taxonomies[ $filter_item['source'] ] )
				AND (
					// For checkboxes
					(
						is_array( $filter_taxonomies[ $filter_item['source'] ] )
						AND in_array( $item_value->slug, $filter_taxonomies[ $filter_item['source'] ] )
					)
					OR
					// For radio buttons
					(
						is_string( $filter_taxonomies[ $filter_item['source'] ] )
						AND $item_value->slug == $filter_taxonomies[ $filter_item['source'] ]
					)
				)
			) {
				$selected_value = ' selected';
				$item_values_counter ++;
			}

			if ( $ui_type == 'radio' and $item_values_counter > 1 ) {
				$selected_value = '';
			}

			$item_value_atts = array(
				'class' => 'w-filter-item-value' . $selected_value,
				'href' => 'javascript:void(0);',
				'tabindex' => '-1',
			);

			// Define hierarchy depth of every term
			if ( ! empty( $terms_parent ) AND $parent = $item_value->parent ) {
				$depth = 1;
				while( $parent > 0 ) {
					if ( $depth > 5 ) { // limit hierarchy by 5 levels
						break;
					}
					if ( isset( $terms_parent[ $parent ] ) ) {
						$parent = $terms_parent[ $parent ];
						$depth ++;
					}
				}
				$item_value_atts['class'] .= ' depth_' . $depth;
			}

			// Output filter item values
			$output .= '<a ' . us_implode_atts( $item_value_atts ) . '>';
			$output .= '<label>';
			$input_atts = array(
				'class' => 'screen-reader-text',
				'aria-hidden' => 'true',
				'type' => $ui_type,
				'value' => $item_value->slug,
				'name' => sprintf( '%s_%s', US_GRID_FILTER_PREFIX, $item_name ),
			);
			$output .= '<input ' . us_implode_atts( $input_atts ) . checked( $selected_value, ' selected', FALSE ) . '>';
			$output .= '<span class="w-form-' . $ui_type . '"></span>';
			$output .= '<span class="w-filter-item-value-label">' . strip_tags( $item_value->name ) . '</span>';

			// Show amount of relevant posts
			if ( ! empty( $filter_item['show_amount'] ) ) {
				$output .= '<span class="w-filter-item-value-amount">' . $item_value->count . '</span>';
			}
			$output .= '</label>';
			$output .= '</a>';
		}

		// Number Range semantics
	} elseif ( $ui_type === 'range' ) {

		$input_min_atts = array(
			'class' => 'w-filter-item-value-input type_min',
			'aria-label' => __( 'Min', 'us' ),
			'placeholder' => __( 'Min', 'us' ),
			'type' => 'text',
		);
		$input_max_atts = array(
			'class' => 'w-filter-item-value-input type_max',
			'aria-label' => __( 'Max', 'us' ),
			'placeholder' => __( 'Max', 'us' ),
			'type' => 'text',
		);
		$input_hidden_atts = array(
			'type' => 'hidden',
			'name' => sprintf( '%s_%s', US_GRID_FILTER_PREFIX, $item_name ),
			'value' => '',
		);

		// Get and set value
		if (
			! empty( $filter_taxonomies[ $filter_item['source'] ] )
			AND $value = us_arr_path( $filter_taxonomies, $filter_item['source'] . '.0', '' )
		) {
			$input_hidden_atts['value'] = $value;
			if ( preg_match( '/(\d+)-(\d+)/', $value, $matches ) ) {
				$input_min_atts['value'] = $matches[1];
				$input_max_atts['value'] = $matches[2];
			}
		}

		// Get MIN and MAX values to show in placeholders
		if ( $item_type === 'cf' ) {
			$range_placeholders = array();

			// Check ACF fields for predefined Min, Max parameters
			if ( ! empty( $acf_field ) ) {
				if ( $min = us_arr_path( $acf_field, 'min', FALSE ) ) {
					$range_placeholders['min'] = $min;
				}
				if ( $max = us_arr_path( $acf_field, 'max', FALSE ) ) {
					$range_placeholders['max'] = $max;
				}
			}
			// Get values from the database
			if ( empty( $range_placeholders ) OR count( $range_placeholders ) !== 2 ) {
				global $wpdb;

				// Get real item name without ID for ACF
				$param = us_grid_filter_parse_param( $filter_item['source'] );
				$real_item_name = us_arr_path( $param, 'param_name', $item_name );

				$range_placeholders = (array) $wpdb->get_row( "
					SELECT
						MIN( cast( meta_value as UNSIGNED ) ) AS min,
						MAX( cast( meta_value as UNSIGNED ) ) AS max
					FROM {$wpdb->postmeta}
					WHERE
						meta_key = " . $wpdb->prepare( '%s', $real_item_name ) . "
						AND meta_value > 0
					LIMIT 1;
				" );
			}
			foreach ( $range_placeholders as $key => $value ) {
				if ( ! in_array( $key, array( 'min', 'max' ) ) OR empty( $value ) ) {
					continue;
				}
				$variable_atts = 'input_' . $key . '_atts';
				$$variable_atts['placeholder'] = $value;
			}
		}

		$output .= '<input ' . us_implode_atts( $input_min_atts ) . '>';
		$output .= '<input ' . us_implode_atts( $input_max_atts ) . '>';
		$output .= '<input ' . us_implode_atts( $input_hidden_atts ) . '>';
	}

	$output .= '</div>';
	$output .= '</div>';
}

$output .= '</div>';
$output .= '</form>';

echo $output;
