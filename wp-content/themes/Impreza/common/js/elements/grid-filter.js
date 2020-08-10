/**
 * UpSolution Element: Grid Filter
 */
;( function( $, undefined ) {
	"use strict";

	/**
	 * US Grid Filter
	 *
	 * @class WGridFilter
	 * @param {string} container The container
	 * @param {object} options The options
	 * @return void
	 */
	$us.WGridFilter = function ( container, options ) {
		this.init( container, options );
	};

	// Export API
	$.extend( $us.WGridFilter.prototype, $us.mixins.Events, {
		/**
		 * @param {string} container The container
		 * @param {object} options The options
		 * @return void
		 */
		init: function ( container, options ) {
			// Variables
			this.defaultOptions = {
				filterPrefix: 'filter', // default prefix
				gridNotFoundMessage: false,
				gridPaginationSelector: '.w-grid-pagination',
				gridSelector: '.w-grid[data-grid-filter="true"]:first',
				layout: 'hor',
				mobileWidth: 600
			};
			this.options = $.extend( this.defaultOptions, options );

			// Elements
			this.$container = $( container );
			this.$filtersItem = $( '.w-filter-item', this.$container );
			this.$grid = $( this.options.gridSelector, $us.$canvas.find( '.l-main' ) );

			// Load json data
			if ( this.$container.is( '[onclick]' ) ) {
				$.extend( this.options, this.$container[0].onclick() || {} );
				this.$container.removeAttr( 'onclick' );
			}

			// Load grid default taxonomies
			if ( this.$grid.length && this.$grid.is( '[onclick]' ) && location.search.indexOf( this.options.filterPrefix ) === -1 ) {
				$.each( ( this.$grid[ 0 ].onclick() || {} ), function( name, value ) {
					// Enable of params which are set in Grid
					$( 'input[name$="'+ name +'"][value="'+ value +'"]', this.$container )
						.prop( 'checked', true )
						.closest( '.w-filter-item-value' )
						.addClass( 'selected' );
				}.bind( this ) );
				this.$grid.removeAttr( 'onclick' );
			}

			// Show the message when suitable Grid is not found
			if ( ! this.$grid.length && this.options.gridNotFoundMessage ) {
				this.$container
					.prepend( '<div class="w-filter-message">' + this.options.gridNotFoundMessage + '</div>' );
			}

			// Set class to define the grid is used by Grid Filter
			this.$grid.addClass( 'used_by_grid_filter' );

			// Events
			this.$container
				.on( 'click', '.w-filter-opener', this._events.filterOpener.bind( this ) )
				.on( 'click', '.w-filter-list-closer', this._events.filterListCloser.bind( this ) );
			// Item events
			this.$filtersItem
				// Exclude [type="number"] these types for range
				.on( 'change', 'input', this._events.changeFilter.bind( this ) )
				.on( 'click', '.w-filter-item-reset', this._events.resetItem.bind( this ) );
			// Pagination
			$( this.options.gridPaginationSelector, this.$grid )
				.on( 'click', '.page-numbers', this._events.loadPageNumber.bind(this ) );
			$us.$window
				.on( 'resize load', $us.debounce( this._events.resize.bind( this ), 100 ) );
			// Built-in private event system
			this
				.on( 'changeItemValue', this._events.toggleItemValue.bind( this ) );

			// Show or Hide filter item
			if ( this.$container.hasClass( 'show_on_click' ) ) {
				this.$filtersItem
					.on( 'click', '.w-filter-item-title', this._events.showItem.bind( this ) );
				$( document )
					.mouseup( this._events.hideItem.bind( this ) );
			}

			// Adding filter options to Woocommerce ordering
			$( 'form.woocommerce-ordering', $us.$canvas )
				.off( 'change', 'select.orderby' )
				.on( 'change', 'select.orderby', this._events.woocommerceOrdering.bind( this ) );

			// Change item values
			this.$filtersItem.each( function( _, item ) {
				this.trigger( 'changeItemValue', item );
			}.bind( this ) );

			// If there are selected parameters then add the class `active` to the main container
			this.$container.toggleClass( 'active', this.$filtersItem.is('.has_value') );
		},
		/**
		 * Determines if mobile.
		 *
		 * @return {boolean} True if mobile, False otherwise.
		 */
		isMobile: function() {
			return parseInt( $us.$window.width() ) < parseInt( this.options.mobileWidth );
		},
		/**
		 * Event handlers
		 * @private
		 */
		_events: {
			/**
			 * Change values
			 *
			 * @param {EventObject} e
			 */
			changeFilter: function( e ) {
				var $target = $( e.currentTarget ),
					$item = $target.closest( '.w-filter-item' ),
					uiType = $item.data( 'ui_type' );

				if ( ['radio', 'checkbox'].indexOf( uiType ) !== -1 ) {
					// Reset All
					if ( uiType === 'radio' ) {
						$( '.w-filter-item-value', $item )
							.removeClass( 'selected' );
					}
					$target
						.closest( '.w-filter-item-value' )
						.toggleClass( 'selected', $target.is( ':checked ') );

				} else if( uiType === 'range' ) {
					var $inputs = $( 'input[type!=hidden]', $item ),
						rangeValues = [];
					$inputs.each( function( i, input ) {
						var $input = $( input ),
							value = input.value || 0;
						// If no value, check placeholders
						if ( ! value && $input.hasClass( 'type_' + [ 'min', 'max' ][ i ] ) && rangeValues.length == i ) {
							value = $input.attr( 'placeholder' ) || 0;
						}
						value = parseInt( value );
						rangeValues.push( ! isNaN( value ) ? value : 0 );
					} );
					// Set values and trigger change event
					rangeValues = rangeValues.join('-');
					$( 'input[type="hidden"]', $item )
						.val( rangeValues !== '0-0' ? rangeValues : '' );
				}

				var value = this.getValue();
				this.URLSearchParams( value );
				// Ignore updates for the mobile version, all filters will be applied after closing the filter section
				if ( ! this.isMobile() ) {
					this.triggerGrid( 'us_grid.updateState', [ value, 1 /* page */ ] );
				}
				// Change item values
				this.trigger( 'changeItemValue', $item );

				// If there are selected parameters then add the class `active` to the main container
				this.$container.toggleClass( 'active', this.$filtersItem.is('.has_value') );
			},
			/**
			 * Load a grid page via AJAX
			 *
			 * @param {EventObject} e
			 * @return void
			 */
			loadPageNumber: function ( e ) {
				e.stopPropagation();
				e.preventDefault();
				var $target = $( e.currentTarget ),
					href = $target.attr( 'href' ) || '',
					matches = ( href.match( /page(=|\/)(\d+)(\/?)/ ) || [] ),
					page = parseInt( matches[2] || 1 /* Default first page */ );

				history.replaceState( document.title, document.title, href );
				this.triggerGrid( 'us_grid.updateState', [ this.getValue(), page ] );
			},
			/**
			 * Reset item selected
			 *
			 * @param {EventObject} e
			 * @return void
			 */
			resetItem: function( e ) {
				var $item = $( e.currentTarget ).closest( '.w-filter-item' ),
					uiType = $item.data( 'ui_type' );

				if ( ! uiType ) {
					return;
				}

				// Reset checkboxes and radio buttons
				if ( 'checkbox|radio'.indexOf( uiType ) !== -1 ) {
					$( 'input:checked', $item ).prop( 'checked', false );

					// Select `All` radio button
					$( 'input[value="*"]:first', $item ).each( function( _, input ) {
						$( input )
							.prop( 'checked', true )
							.closest( '.w-filter-item' )
							.addClass( 'selected' );
					} );
				}

				// Reset range values
				if ( uiType === 'range' ) {
					$( 'input', $item ).val( '' );
				}

				// Clear css classes
				$( '.w-filter-item-value', $item ).removeClass( 'selected' );

				// Change item values
				this.trigger( 'changeItemValue', $item );

				// If there are selected parameters then add the class `active` to the main container
				this.$container.toggleClass( 'active', this.$filtersItem.is('.has_value') );

				// Update URL
				var value = this.getValue();
				this.URLSearchParams( value );
				// Ignore updates for the mobile version, all filters will be applied after closing the filter section
				if ( ! this.isMobile() ) {
					this.triggerGrid( 'us_grid.updateState', [ value, 1 /* page */ ] );
				}
			},
			/**
			 * Change item values
			 *
			 * @param {object} _ self
			 * @param {mixed} item
			 * @return void
			 */
			toggleItemValue: function( _, item ) {
				var $item = $( item ),
					title = '',
					hasValue = false,
					uiType = $item.data('ui_type'),
					$selected =  $( 'input:not([value="*"]):checked', $item );

				if ( ! uiType ) {
					return;
				}
				// Get title from radio buttons and checkboxes
				if ( 'checkbox|radio'.indexOf( uiType ) !== -1 ) {
					hasValue = $selected.length;

					// For a horizontal filter, if there are selected parameters, display either the selected parameter or quantity
					if ( this.options.layout == 'hor' ) {
						var title = '';
						if ( $selected.length === 1 ) {
							title += ': ' + $selected.nextAll( '.w-filter-item-value-label:first' ).text();
						} else if( $selected.length > 1 ) {
							title += ': ' + $selected.length;
						}
					}
				}
				// Get title from range inputs
				if ( uiType === 'range' ) {
					var value = $( 'input[type="hidden"]:first', $item ).val();
					if ( value ) {
						hasValue = !! value;
						title += ': ' + value;
					}
				}

				// Add of `has_value` class when selecting options
				$item.toggleClass( 'has_value', !! hasValue );
				// Update item title
				$( '> .w-filter-item-title:first > span', item ).html( title );
			},
			/**
			 * Changes when resizing the screen
			 * @return void
			 */
			resize: function() {
				this.$container
					.usMod( 'state', this.isMobile() ? 'mobile' : 'desktop' );
				if ( ! this.isMobile() ) {
					$us.$body
						.removeClass( 'us_filter_open' );
					this.$container
						.removeClass( 'open' /* filter opener */ );
				}
			},
			/**
			 * Open Mobile Filter
			 * @return void
			 */
			filterOpener: function() {
				$us.$body
					.addClass( 'us_filter_open' );
				this.$container
					.addClass( 'open' );
			},
			/**
			 * Close Mobile Filter
			 * @return void
			 */
			filterListCloser: function() {
				$us.$body
					.removeClass( 'us_filter_open' );
				this.$container
					.removeClass( 'open' );
				// After closing the mobile version of filters, force to update the result
				this.triggerGrid( 'us_grid.updateState', [ this.getValue(), 1 /* page */ ] );
			},
			/**
			 * Show vertical items
			 *
			 * @param {EventObject} e
			 * @return void
			 */
			showItem: function( e ) {
				var $target = $( e.currentTarget ),
					$item = $target.closest( '.w-filter-item' );
				$item.addClass( 'show' );
			},
			/**
			 * Hide vertical items when click outside the item
			 *
			 * @param {EventObject} e
			 * @return void
			 */
			hideItem: function( e )  {
				if ( ! this.$filtersItem.hasClass( 'show' ) ) {
					return;
				}
				this.$filtersItem
					.filter( '.show' )
					.each( function( _, item ) {
						var $item = $( item );
						if ( ! $item.is( e.target ) && $item.has( e.target ).length === 0 ) {
							$item.removeClass( 'show' );
						}
					} );
			},
			/**
			 * Add grid filter options to sort request
			 *
			 * @param {EventObject} e
			 * @return void
			 */
			woocommerceOrdering: function( e ) {
				e.stopPropagation();
				var $form = $( e.currentTarget ).closest( 'form' );
				$( 'input[name^="'+ this.options.filterPrefix +'"]', $form )
					.remove();
				$.each( this.getValue().split( '&' ), function( _, item ) {
					var value = item.split( '=' );
					if ( value.length === 2 ) {
						$form.append( '<input type="hidden" name="'+ value[0] +'" value="'+ value[1] +'"/>' );
					}
				} );
				$form.trigger( 'submit' );
			}
		},

		/**
		 * Raises a private event in the grid
		 *
		 * @param {string} eventType
		 * @param mixed extraParameters
		 * @return void
		 */
		triggerGrid: function ( eventType, extraParameters ) {
			$us.debounce( function() { $us.$body.trigger( eventType, extraParameters ); }, 10 )();
		},
		/**
		 * Get the value.
		 *
		 * @return {string}
		 */
		getValue: function() {
			var value = '',
				filters = {};
			$.each( this.$container.serializeArray(), function( _, filter ) {
				if ( filter.value === '*' /* All */ || ! filter.value ) {
					return;
				}
				if ( ! filters.hasOwnProperty( filter.name ) ) {
					filters[ filter.name ] = [];
				}
				filters[ filter.name ].push( filter.value );
			} );
			// Convert params in a string
			for ( var k in filters ) {
				if ( value ) {
					value += '&';
				}
				if ( $.isArray( filters[ k ] ) ) {
					value += k + '=' + filters[ k ].join( ',' );
				}
			}

			return encodeURI( value );
		},
		/**
		 * Set search queries in the url
		 *
		 * @param {string} params The query parameters
		 * @return void
		 */
		URLSearchParams: function( params ) {
			var url = location.origin + location.pathname + ( location.pathname.slice( -1 ) != '/' ? '/' : '' ),
				// Get current search and remove filter params
				search = location.search.replace( new RegExp( this.options.filterPrefix + "(.+?)(&|$)", "g" ), '' );
			if ( ! search || search.substr( 0, 1 ) !== '?' ) {
				search += '?';
			} else if( '?&'.indexOf( search.slice( -1 ) ) === -1 ) {
				search += '&';
			}
			// Remove last ?&
			if ( ! params && '?&'.indexOf( search.slice( -1 ) ) !== -1 ) {
				search = search.slice( 0, -1 );
			}
			history.replaceState( document.title, document.title, url + search + params );
		}
	} );

	// Add to jQuery
	$.fn.wGridFilter = function ( options ) {
		return this.each( function () {
			$( this ).data( 'wGridFilter', new $us.WGridFilter( this, options ) );
		} );
	};

	// Init
	$( function() {
		$( '.w-filter', $us.$canvas ).wGridFilter();
	} );
})( jQuery );
