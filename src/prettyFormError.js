/* dev-code */
/*  */
/* global IprettyError Positions */
/* end-dev-code */
/** Setting defualt properties values if user
 *  doesn't specify them
 * @param {IprettyError} opts Object implementing IprettyError
 * @returns {IprettyError} Default plugin config
  */
function _optionsConfig( opts ) {
  var innerOpts = opts || {};
  var positionMethod;
  var classError = innerOpts.classError || 'prettyFormError';
  var callToAction = innerOpts.callToAction || 'button';
  var elementError = innerOpts.elementError || 'div';
  var focusErrorOnClick = innerOpts.focusErrorOnClick || true;
  var tempFadeOpt = {fadeOut: false, fadeOutOpts: ''};
  var tempMulti = {enabled: false, selector: '.multiCheckbox'};
  var fadeOutError = innerOpts.fadeOutError || tempFadeOpt;
  var multiCheckbox = innerOpts.multiCheckbox || tempMulti;
  if ( 'positionMethod' in innerOpts ) {
    positionMethod = innerOpts.positionMethod  === 'after' ? 'afterend' : 'beforebegin';
  } else {
    positionMethod = innerOpts.positionMethod  = 'afterend';
  }

  return {
    classError: classError,
    elementError: elementError,
    positionMethod: positionMethod,
    multiCheckbox: multiCheckbox,
    callToAction: callToAction,
    focusErrorOnClick: focusErrorOnClick,
    fadeOutError: fadeOutError
  };
}


/**
 * Filters the invalid errors
 * @param {HTMLElement} elem parent element, the for itself
 * @returns {Array<HTMLElement>} Invalid form elements
 */
function _getInvalidElems( elem ) {
  // fieldset elements also receive the validity pseudo-selector
  var invalids = elem.querySelectorAll( ':invalid:not(fieldset)' );
  var notValidated = [];
  [].forEach.call( invalids, function( invalid ) {
    if ( !invalid.validity.valid ) {
      notValidated.push( invalid );
    }
  });
  return notValidated;
}


/**
 Global factory for PrettyFormErrorInstance
 *  using vanilla JS
 * @param {string} selector CSS selector, should be a form
 * @param {IprettyError} opts possible user options
 * @return {void}
 */
function PrettyFormErrorInstance( selector, opts ) {
  this.options = _optionsConfig( opts );
  var options = this.options;

  function _removeOldErrors( element ) {
    if ( element ) {
      var oldErrors = element.querySelectorAll( '.' + options.classError );
      [].forEach.call( oldErrors, function( error ) {
        error.remove();
      });
    }
  }

  /**
   * Creates HTML to hold the error for all invalid inputs
   * @param {string} elementError Name tag to create for the error
   * @param {HTMLInputElement} invalidElem Form element to validate
   * @param {Positions} positionMethod position to place the generated markup
   * @return {void}
   */
  function _createErrorElement(
    elementError,
    invalidElem,
    positionMethod
  ) {
    var div = document.createElement( elementError );
    div.classList.add( options.classError );
    div.textContent = invalidElem.validationMessage;
    invalidElem.insertAdjacentElement( positionMethod, div );
  }

   /**
   * Add click eventlistener
   * @param {HTMLElement} elem Form element
   * @return {void}
   */
  function _clickHandler( elem ) {
    var caller = elem.querySelector( options.callToAction );
    if ( caller ) {
      caller.addEventListener( 'click', function() {
        var invalids = _getInvalidElems( elem );

        // Deleting old errors
        if ( document.querySelector( '.' + options.classError )) {
          _removeOldErrors( elem );
        }
        [].forEach.call( invalids, function ( invalid ) {
          _createErrorElement(
            options.elementError,
            invalid,
            options.positionMethod
          );
        });

        // focusing on first errrored input
        if ( invalids.length > 0 && options.focusErrorOnClick ) {
          invalids[ 0 ].focus();
        }
      });
    }
  }

  if ( typeof jQuery === 'undefined' ) {
    var elem = document.querySelectorAll( selector );
    [].forEach.call( elem, function( element ) {
      _clickHandler( element );
    });
  } else {
    $.each( $( selector ), function ( index, item ) {
      _clickHandler( item );
    });
  }
}

function prettyFormError( elem, options ) {
  return new PrettyFormErrorInstance( elem, options );
}

// jQuery setup
if ( typeof jQuery !== 'undefined' ) {
  $.fn.prettyFormError = function( options ) {
    var pluginName = 'prettyFormError';
    var dataKey = 'plugin_' + pluginName;
    return this.each( function() {
      if ( !$.data( this, dataKey )) {
        $.data( this, dataKey, prettyFormError( this, options ));
      }
    });
  };
}

// Browser setup
if ( !( 'prettyFormError' in window )) {
  window.prettyFormError = prettyFormError;
}
