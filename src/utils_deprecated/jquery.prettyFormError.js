/* global IprettyError */

( function( factory ) {
  'use strict';
  if ( typeof module === 'object' && typeof module.exports === 'object' ) {
    factory( require( 'jquery' ), window, document ); // CommonJS
  } else {
    factory( jQuery, window, document ); // Browser globals
  }
})( function( jQuery, window, document ) {
  var pluginName = 'prettyFormError';
  var dataKey = 'plugin_' + pluginName;

  // utils
  function createErrorsForInvalid( invalid, options: IprettyError ) {
    return $.each( invalid, function( index, value ) {
      var errors = $( '<' + options.elementError + '>' )
        .addClass( options.classError )
        .text( value.validationMessage );
      // position for error message -> before or after
      $( value )[ options.positionMethod ]( errors );
    });
  }

  // Plugin constructor
  var Plugin = function( element, options: IprettyError ) {
    this.element = $( element );
    this.options = {
      multiCheckbox: {
        enabled: false,
        selector: '.multiCheckbox'
      },
      classError: 'prettyFormError',
      positionMethod: 'after',
      elementError: 'div',
      callToAction: 'button',
      focusErrorOnClick: true,
      fadeOutError: {fadeOut: false, fadeOutOpts: ''}
    };

    this.init( options );
  };

  Plugin.prototype = {
    init: function( options: IprettyError ) {
      // user options checker for positionMethod
      // to avoid breaking the plugin initialization
      if ( options !== undefined &&
          options.positionMethod !== undefined &&
          options.positionMethod !== 'after' &&
          options.positionMethod !== 'before'
        ) {
        console.warn(
          'positionMethod prop values should be "after" or "before", a default "after" value has been assigned'
        );
        options.positionMethod = 'after';
      }

      $.extend( this.options, options );

      // multiCheckbox configuration
      if ( this.options.multiCheckbox.enabled ) {
        this.multiCheckboxConfig( this.options );
      }

      this.handleClickCallToAction( this.element, this.options );
    },

    // workaround to validate the multiple
    // checkboxes that at least one value is required
    multiCheckboxConfig: function( options: IprettyError ) {
      var allCheckboxes = $( options.multiCheckbox.selector );
      allCheckboxes
        .change( function() {
          if ( allCheckboxes.is( ':checked' )) {
            allCheckboxes.removeAttr( 'required' );
          } else {
            allCheckboxes.attr( 'required', 'required' );
          }
        });
    },

    // button click handler
    handleClickCallToAction: function( element, options: IprettyError ) {
      var btn = element.find( options.callToAction );

      btn.on( 'click', function( event ) {
        var invalid = element.find( ':invalid' ).not( 'fieldset' );

        if ( invalid.length > 0 ) {
          event.preventDefault();
          // removing the old errors
          $( '.' + options.classError ).remove();
          // targeting all invalid errors,
          // fieldset elements also receive the validity pseudo-selector

          // Adding errors to :invalid elements
          createErrorsForInvalid( invalid, options );

          // focus the first element with error
          if ( options.focusErrorOnClick && invalid.length > 1 ) {
            invalid[ 0 ].focus();
          }

          // fadeOut de errors
          if ( options.fadeOutError.fadeOut ) {
            $( '.' + options.classError )
              .fadeOut( options.fadeOutError.fadeOutOpts );
          }
        }
      });
    }
  };

  $.fn[ pluginName ] = function( options ) {
    return this.each( function() {
      if ( !$.data( this, dataKey )) {
        $.data( this, dataKey, new Plugin( this, options ));
      }
    });
  };
});
