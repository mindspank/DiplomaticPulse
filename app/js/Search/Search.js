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

    this.$input = $(element);
    this.q = QIX.app;
    this.field = field || 'teaser';        
    this.minChars = 3;
    this.$nohits = $('#search-nohits');
    
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
        this.$nohits.hide();
        
        this.q.getField(this.field).then(function(f) { 
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
      this.$input.on('input', debounce(function(event) {
        that._keyup(event);
      },250));
    },
    /**
     * Perform a Qlik Sense associative search scope to field teaser and respects currentselections in the data model
     */
    lockFields: function() {
      
    },
    doSearch: function(term) {
      
      var that = this;
      
      if ( term.split('')[0] !== '=' ) {

      term = term.split(' ').map(function(d) { 
        return '+' + d; 
       }).join(' ').trim();       
      }

      that.listobject.searchListObjectFor('/qListObjectDef',term)   
      .then(function() {
        return that.listobject.getListObjectData('/qListObjectDef',[{"qTop":0,"qLeft":0,"qWidth":1,"qHeight":1000}]);
      })
      .then(function(data) {
        if ( data[0].qMatrix.length === 0 ) {
          
          that.listobject.abortListObjectSearch('/qListObjectDef').then(function() {
            pubsub.publish('nodata');
          })

        } else {

          that.listobject.getLayout().then(function(layout) {
            if( layout.qListObject.qDataPages[0].qMatrix[0][0].qState === 'O' ) {
            
              that.listobject.acceptListObjectSearch('/qListObjectDef', false).then(function() {
                $('#main').fadeTo(50,0.5).fadeTo(200,1);
                pubsub.publish('update');
              });
            
            } else {
              
              that.listobject.abortListObjectSearch('/qListObjectDef').then(function() {
                pubsub.publish('nodata', true);
              });
            
            }
          })
                                    
        }
      });
      
      
    },
    /**
     * Clear a Search made in the Qlik Sense data model
     */
    clear: function() {
      var that = this;
      var input = document.getElementById('qv-search');
      var button = document.getElementById('qv-search-clear');
      
      if(input.value.length === 0) return;
      
      button.style.display = 'none';
      
      /**
       * Clear any selections in the teaser field in Qlik Sense
       */
      this.q.getField(this.field).then(function(f) { 
          f.clear().then(function() {
            input.value = '';
            $('#search-nohits').hide();
            
            //Perform a quick fade to notify the user that the UI has changed
            $('#main').fadeTo(50,0.5).fadeTo(200,1);
            
            //Notify objects that they should update
            pubsub.publish('update');
          });
      });
    },
    clearFilters: function() {
      this.q.clearAll().then(function() {
        document.getElementById('search-nohits-filter').style.display = 'none'
        this.doSearch(document.getElementById('qv-search').value)
      }.bind(this))
    },
    nodata: function(topic, clear) {
      if (clear) {
        var $filter = $('#search-nohits-filter');
        
        $filter.css('width', $('#content').width() )
        .find('span')
          .text( $('#qv-search').val() );
            
        $filter.show(); 
               
      } else {
        var $nohits = $('#search-nohits');
        
        $nohits.css('width', $('#content').width() )
        .find('span')
          .text( $('#qv-search').val() );
            
        $nohits.show();
         
      }
    },
    /**
     * Initialize Search
     * Bind events and setup event listeners
     */
    init: function() {
      
      var that = this;
      
      QIX.app.createSessionObject({
        qInfo: {
          qId: "",
          qType: "ListObject"
        },
        qSelectionObjectDef: {},
        qListObjectDef: {
          qLibraryId: "",
          qShowAlternatives: false,
          count: {
            qValueExpression: "=Count(teaser)",
          },
          qDef: {
            qFieldDefs: ['teaser']
          },          
          qSortCriterias: [
            {
              "qSortByState": 1
            }
          ],
          qInitialDataFetch: [{
            "qTop": 0,
            "qHeight": 30,
            "qLeft": 0,
            "qWidth": 1
          }]
        }
      }).then(function(handle) {
        that.listobject = handle;
      })
      
      this.bindevents();
      
      var clearbutton = document.getElementById('qv-search-clear');
      clearbutton.addEventListener('click', function() {
        this.clear();
      }.bind(this), false);
      
      var clearinlinebutton = document.getElementById('inline-filter-clear');
      clearinlinebutton.addEventListener('click', function() {
        this.clearFilters();
      }.bind(this), false);
      
      pubsub.subscribe('nodata', that.nodata);
      
    }
  };

  return Search;

})();