/**
 * Suggestions - Currently not used and not finished.
 */
var Suggestion = (function() {
  'use strict';
    
  function Suggestion(element) {
    this.$parent = $(element);
    this.$element = buildContainer(this.$parent);
    this.hasSuggestions = false;        
  };
    
  var buildContainer = function(element) {
    var tmpl = '<div id="suggestions"><ul></ul></div>';
    return element.after(tmpl);
  };
  
  var buildList = function(data) {
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
  
})();

/**
 * Main Search. Allows users to free text search in the teaser field in the Qlik Sense data model.
 */
var Search = (function() {
  'use strict';

  var specialKeyCodeMap = {
    9: 'tab',
    27: 'esc',
    37: 'left',
    39: 'right',
    13: 'enter',
    38: 'up',
    40: 'down',
    32: 'space',
    16: 'shift',
    17: 'ctrl'
  };
  
  function Search(element, field) {

    var that = this;

    this.$input = $(element);
    this.q = QIX.app;
    this.field = field || 'Content';
        
    this.minChars = 3;
    
    this.init();
    
  };
  
  Search.prototype = {
    _keyup: function(e) {
      /**
       * Break on special keys
       */
      if( specialKeyCodeMap[e.keyCode] || specialKeyCodeMap[e.which] ) return false;
      
      /**
       * If search was deleted make sure the data model clears any searches already made
       */
      if( e.currentTarget.value.length == 0 ) {
        
        $('#qv-search-clear').hide();
        
        this.q.getField('teaser').then(function(f) { 
          f.clear().then(function() { 
            $('#main').fadeTo(50,0.5).fadeTo(200,1);
            pubsub.publish('update') })
         });
      }
     
      //Break on minimum length
      if( e.currentTarget.value.length < this.minChars ) return false;
      
      /**
       * Perform Search and show clear search button
       */
      $('#qv-search-clear').show();
      this.doSearch(e.target.value);
      
    },
    /**
     * Listen for events
     * Currently listening for keyup and delegating to _keyup()
     */
    bindevents: function() {
      
      var that = this;      
      this.$input.on('keyup', debounce(function(event) {
        that._keyup(event);
      },250));
    },
    /**
     * Perform a Qlik Sense associative search scope to field teaser and respects currentselections in the data model
     */
    doSearch: function(term) {

      var searchTerm = term.split(' ');
      this.q.selectAssociations({qSearchFields: ['teaser'], qContext: 'CurrentSelections'}, searchTerm, 0).then(function(results) {
        
        //Perform a quick fade to notify the user that the UI has changed
        $('#main').fadeTo(50,0.5).fadeTo(200,1);
        
        //Notify objects that they should update
        pubsub.publish('update');
      });
      
    },
    /**
     * Clear a Search made in the Qlik Sense data model
     */
    clear: function() {
      var input = document.getElementById('qv-search');
      var button = document.getElementById('qv-search-clear');
      if(input.value.length === 0) return;
      
      button.style.display = 'none';
      
      /**
       * Clear any selections in the teaser field in Qlik Sense
       */
      this.q.getField('teaser').then(function(f) { 
          f.clear().then(function() {
            input.value = '';
            
            //Perform a quick fade to notify the user that the UI has changed
            $('#main').fadeTo(50,0.5).fadeTo(200,1);
            
            //Notify objects that they should update
            pubsub.publish('update');
          });
      });
    },
    /**
     * Initialize Search
     * Bind events and setup event listeners
     */
    init: function() {

      this.bindevents();
      
      var clearbutton = document.getElementById('qv-search-clear');
      clearbutton.addEventListener('click', function() {
        this.clear();
      }.bind(this), false);
      
    }
  };

  return Search;

})();