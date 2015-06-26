/* global $ */
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

var Search = (function() {
  'use strict';
	
  var obj = {
		"qInfo": {
			"qId": "",
			"qType": "ListObject"
		},
		"qListObjectDef": {
			"qDef": {
				"qFieldDefs": [
					'teaser'
				]
			},
			"qInitialDataFetch": [{
				"qTop": 0,
				"qHeight": 300,
				"qLeft": 0,
				"qWidth": 1
			}]
		}
	};
  
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
    
    this.handle;
    
    this.minChars = 3;
    
    //this.suggest = new Suggestion(this.$input);
    this.q.createSessionObject(obj).then(function(f) {
      that.handle = f;
      that.init();
    });
    
  };
  
  Search.prototype = {
    _keyup: function(e) {
      //Break on special keys
      if( specialKeyCodeMap[e.keyCode] || specialKeyCodeMap[e.which] ) return false;
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
      
      $('#qv-search-clear').show();
      this.doSearch(e.target.value);
      
    },
    bindevents: function() {
      
      var that = this;      
            
      this.$input.on('keyup', debounce(function(event) {
        that._keyup(event);
      },250));
    },
    doSearch: function(term) {
      var that = this;

      var searchPage = {
        qOffset: 0,
        qCount: 50,
        qMaxNbrFieldMatches: -1
      };
      
      var searchTerm = term.split(' ');
      this.q.selectAssociations({qSearchFields: ['teaser'], qContext: 'CurrentSelections'}, searchTerm, 0).then(function(results) {
        $('#main').fadeTo(50,0.5).fadeTo(200,1);
        pubsub.publish('update');
      });
      
    },
    clear: function() {
      var input = document.getElementById('qv-search');
      var button = document.getElementById('qv-search-clear');
      if(input.value.length === 0) return;
      
      button.style.display = 'none';
      
      this.q.getField('teaser').then(function(f) { 
          f.clear().then(function() {
            input.value = '';
            $('#main').fadeTo(50,0.5).fadeTo(200,1);
            pubsub.publish('update');
          });
      });
    },
    init: function() {
           
      this.bindevents();
      
      var clearbutton = document.getElementById('qv-search-clear');
      clearbutton.addEventListener('click', function() {
        this.clear();
      }.bind(this), false)
      
    }
  };

  return Search;

})();