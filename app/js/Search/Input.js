var Suggestion = (function($) {
  
  function Suggestion(element) {
    this.$parent = element;
    this.$element = buildContainer(element);
    this.hasSuggestions = false;        
  };
  
  Suggestion.prototype = Object.create(Object.prototype, {
    
    
    
  });
  
  function buildContainer(element) {
    this.tmpl = '<div id="suggestions"><ul></ul></div>';
    return element.after(this.tmpl);
  };
  
  function buildList(data) {
    this.tmpl = '<ul>';
    
    data.forEach(function(d, i) {
      if( i === 0 ) {
        this.tmpl += '<li class="active">' + d + '</li>';
      } else {
        this.tmpl =+ '<li>' + d + '</li>';
      }
    },this);
    
    this.tmpl += '</ul>';
    
    return this.templ;
    
  };
  
  
  return Suggestion;
  
})(jQuery);

var Input = (function($) {
  'use strict';

  var specialKeyCodeMap = {
    9: 'tab',
    27: 'esc',
    37: 'left',
    39: 'right',
    13: 'enter',
    38: 'up',
    40: 'down'
  };

  function Input(element) {

    this.$input = $(element);
    this.search = this.$input.val();
    this.q = QIX.app;

  };
  
  Input.prototype = Object.create(Object.prototype, {
    
    bind: function() {
      
      var that = this, onBlur, onFocus, onKeydown, onInput;
      
      onKeydown = this._onKeydown.bind(this);
      
      this.$input
      .on('keydown.tt', onKeydown);
      
      
    }
    
  });

  return Input;

})(jQuery);