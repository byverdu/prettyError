// prettyError jQuery plugin

;( function( $, window, document, undefined ) { // eslint-disable-line
  var pluginName = 'prettyError';
  var dataKey = 'plugin_' + pluginName;

  // utils
  function createErrorsForInvalid(invalid, options) {
    return $.each( invalid, function( index, value ) {
      var errors = $('<' + options.elementError + '>')
        .addClass( options.classError )
        .text( value.validationMessage );
      // position for error message -> before or after
      $( value )[options.positionMethod]( errors );
    });
  }

  // Plugin constructor
  var Plugin = function( element, options ) {
    this.element = $(element);
    this.options = {
      multiCheckbox: {
        enabled: false,
        selector: '.multiCheckbox'
      },
      classError: 'prettyError',
      positionMethod: 'after',
      elementError: 'div',
      callToAction: 'button',
      focusErrorOnClick: true,
      fadeOutError: {fadeOut: false}
    };

    this.init( options );
  };

  Plugin.prototype = {
    init: function( options ) {
      // handleling errors
      if (options !== undefined) {
        options = this.handleErrorsInOpts(options);
      }

      $.extend( this.options, options );

      // multiCheckbox configuration
      if (this.options.multiCheckbox.enabled) {
        this.multiCheckboxConfig(this.options);
      }

      this.handleClickCallToAction( this.element, this.options );
    },

    // workaround to validate the multiple
    // checkboxes that at least one value is required
    multiCheckboxConfig: function(options) {
      var allCheckboxes = $( options.multiCheckbox.selector );
      allCheckboxes
        .change(function() {
          if (allCheckboxes.is(':checked')) {
            allCheckboxes.removeAttr('required');
          } else {
            allCheckboxes.attr('required', 'required');
          }
        });
    },

    // user options checker to avoid breaking the plugin initialization
    handleErrorsInOpts: function(options) {
      var positionMethod = {
        opts: options.positionMethod,
        text: 'positionMethod prop values should be "after" or "before", a default "after" value has been assigned'
      };

      var focusErrorOnClick = {
        opts: options.focusErrorOnClick,
        text: 'focusErrorOnClick prop value should be a Boolean'
      };

      // options.positionMethod
      if (positionMethod.opts !== 'after' &&
          positionMethod.opts !== 'before' &&
          positionMethod.opts !== undefined
        ) {
        console.warn(positionMethod.text);
        options.positionMethod = 'after';
      }

      // options.focusErrorOnClick
      if ( typeof focusErrorOnClick.opts !== 'boolean' &&
      focusErrorOnClick.opts !== undefined) {
        console.warn(focusErrorOnClick.text);
        options.focusErrorOnClick = true;
      }

      return options;
    },

    // button click handler
    handleClickCallToAction: function( element, options ) {
      var btn = element.find( options.callToAction );

      btn.on( 'click', function( event ) {
        event.preventDefault();
        // removing the old errors
        $( '.' + options.classError ).remove();

        // targeting all invalid errors,
        // fieldset elements also receive the validity pseudo-selector
        var invalid = element.find( ':invalid' ).not( 'fieldset' );

        // Adding errors to :invalid elements
        createErrorsForInvalid( invalid, options );

        // focus the first element with error
        if ( options.focusErrorOnClick && invalid.length > 1 ) {
          invalid[0].focus();
        }

        // fadeOut de errors
        if ( options.fadeOutError.fadeOut ) {
          $( '.' + options.classError )
            .fadeOut( options.fadeOutError.fadeOutOpts );
        }
      });
    }
  };

  $.fn[ pluginName ] = function( options ) {
    return this.each( function() {
      if ( !$.data( this, dataKey ) ) {
        $.data( this, dataKey, new Plugin( this, options ) );
      }
    });
  };
}( jQuery, window, document ));
