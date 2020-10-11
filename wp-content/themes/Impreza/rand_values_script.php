<?php

//rand custom post type counter
//returns random post id from picked position

function get_rand_values($position){

    $pos_array = array();

    $query = new WP_Query( [
        'post_type' => 'seo',
        'trim' => $position
    ] );
    
    global $post;
    
    if ( $query->have_posts() ) {
        while ( $query->have_posts() ) {
            $query->the_post();
            array_push($pos_array, get_the_ID());
        }
	}
	
	else {
		return ( '0' );
	}

    wp_reset_postdata();

    return ($pos_array[array_rand($pos_array)]);

}


//return array with all published posts
function get_publish_posts($post_type){
    

	$posts_array = array();
	
	global $wpdb;

	$the_row = $wpdb->get_results("SELECT ID FROM $wpdb->posts WHERE post_status = 'publish' AND post_type = '$post_type'", ARRAY_N);

	$var_count = count($the_row);

	//print_r( $the_row[3][0]);

	foreach($the_row as $arr){
		foreach($arr as $id){
			array_push( $posts_array, $id);
		}

	}

	$wpdb -> flush();

    return($posts_array);

}


function get_rand_post($post_type, $position){

    global $wpdb;

    switch ($position){
		case '0h':
			$i = 0;
			break;
		case '0t':
			$i = 1;
			break;
		case '2h':
			$i = 2;
			break;
		case '3h':
			$i = 3;
			break;
		case '3t1':
			$i = 4;
			break;
		case '3t2':
			$i = 5;
			break;
		case '4h':
			$i = 6;
			break;
		case '4t':
			$i = 7;
			break;
		case '5t':
			$i = 8;
			break;
		case '6t':
			$i = 9;
			break;
		case '7t':
			$i = 10;
			break;			
		case '8t':
			$i = 11;
			break;
		case '9t':
			$i = 12;
			break;
	}

	$val_array = get_publish_posts($post_type);


    foreach ($val_array as $value) {

        $the_row = $wpdb->get_row("SELECT * FROM $wpdb->postmeta WHERE meta_key = 'rand-values' AND post_id = '$value'", ARRAY_N );

        $rand_val_array = explode(" ", $the_row[3]);

		$rand_val_array[$i] = get_rand_values($position);

		$rand_val_array = implode(' ', $rand_val_array);
		
		$wpdb->update( 'wp_postmeta',
		array ('meta_value' => $rand_val_array), 
		array ( 'post_id' => $value, 'meta_key' => 'rand-values')
		);


	}
	
	$wpdb->flush();
 
}

