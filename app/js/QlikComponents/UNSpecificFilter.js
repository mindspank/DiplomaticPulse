/**
 * jQuery plugin to toggle visibility on filter counters
 */
(function($) {
    $.fn.invisible = function() {
        return this.each(function() {
            $(this).css("visibility", "hidden");
        });
    };
    $.fn.visible = function() {
        return this.each(function() {
            $(this).css("visibility", "visible");
        });
    };
}(jQuery));

function UNFilter(container) {

  var list;

  var FILTERS = [{
      label: 'Member State',
      id: 'Member State'
    }, 
    { 
      label: 'Int. Organization',
      id: 'International Organization'
    }, 
    { 
      label: 'UN Systems',
      id: 'United Nations System'
    }].reduce(function(d, item) {
      
      d[item.id] = d[item.id] || {};
      
      var tmpl = '<div id="' + item.id.replace(/\s+/g, '').replace(/\./g, '') + '" class="filter">';
      tmpl += '<div class="title">' + item.label;
      tmpl += '  <div class="right"><div class="count" style="visibility: hidden;"></div><img src="static/img/toggle.svg"></div>';
      tmpl += '</div>';
      tmpl += '<div class="items"></div>';
      tmpl += '</div>';
      
      var $template = $(tmpl);
      $template.find('.title').on('click', function() {
        $(this).parent().toggleClass('expanded')
      });
 
      d[item.id].id = item.id;
      d[item.id].dom = $template;
      
      $template.appendTo(container);
 
      return d
    }, {});
    
  /**
   * Create the Qlik Sense Object
   * https://help.qlik.com/sense/2.0/en-us/developer/Subsystems/EngineAPI/Content/GenericObject/PropertyLevel/ListObjectDef.htm
   * 
   * Returns a promise which will call render once it's fulfilled.
   */
  QIX.app.createSessionObject({
    "qInfo": {
      "qId": "",
      "qType": "ListObject"
    },
    "qListObjectDef": {
      "qLibraryId": "",
      "qShowAlternatives": true,
      "qDef": {
        "qFieldDefs": ['[Entity Name]'],
        "qSortCriterias": [{
			     "qSortByAscii": 1
		    }]
      },
      "qExpressions": [{
        "qExpr": "=only({1}[Entity Type])"
      }],
      "qInitialDataFetch": [{
        "qTop": 0,
        "qHeight": 500,
        "qLeft": 0,
        "qWidth": 2
      }]
    }
  }).then(function(reply) {
    list = reply;
    render();
  });

  function render() {
    /**
     * Get the layout/data of the List Object
     */
    list.getLayout().then(function(layout) {
      
      listId = layout.qInfo.qId;
      
      var items = layout.qListObject.qDataPages[0].qMatrix;
      var combinedLists = items.map(function(item) { 
        return {
            membertype: item[1].qText,
            membername: item[0].qText,
            elemNumber: item[0].qElemNumber,
            state: item[0].qState
          };
        })
        .filter(function(item) {
          return item.membertype !== '-'
        })
        .reduce(function(membertype, item) {
          
          membertype[item.membertype] = membertype[item.membertype] || {};
          membertype[item.membertype].selected = membertype[item.membertype].selected || 0;
          membertype[item.membertype].items = membertype[item.membertype].items || [];
          
          membertype[item.membertype].items.push('<li data-elem="' + item.elemNumber + '" class="' + item.state + ' listitem"><p class="value">' + item.membername + '</p></li>')
          membertype[item.membertype].totalitems = membertype[item.membertype].items.length;
          
          if(item.state === 'S') ++membertype[item.membertype].selected;
          return membertype;
        }, {});
        
        Object.keys(FILTERS).forEach(function(d) {
          
          FILTERS[d].dom.find('ul').remove();

          $('<ul class="list" />').html(combinedLists[d].items.join('')).appendTo(FILTERS[d].dom.find('.items'));
          
          if(combinedLists[d].selected != 0) {
            FILTERS[d].dom.find('.count').visible().text(combinedLists[d].selected + ' of ' + combinedLists[d].totalitems);
          } else {
            FILTERS[d].dom.find('.count').invisible();
          }
          
          FILTERS[d].dom.find('li:not(.x)').on('click', function() {
            select($(this).attr('data-elem'))
          })
          
          FILTERS[d].dom.appendTo(container);

          if($('#' + FILTERS[d].id.replace(/\s+/g, '').replace(/\./g, '')).find('.search').length === 0 ) {
            $('#' + FILTERS[d].id.replace(/\s+/g, '').replace(/\./g, '')).find('.items').before('<input class="search" placeholder="Search list"/>')
          }
 
          var s = new List(document.getElementById(FILTERS[d].id.replace(/\s+/g, '').replace(/\./g, '')), {
            valueNames: ['value']
          });         
          
          $('input.search').val('')
          
        });

    });
  };
  
  /**
   * Select a value in the Qlik Sense Data Model.
   * Will trigger a update message to notify other objects to update accordingly.
   */
  function select(qElem) {
    list.selectListObjectValues("/qListObjectDef", [+qElem], true, false).then(function(success) {
      $('#clearfilter').addClass('active');
      pubsub.publish('update');
    }, function(error) {
      console.log(error);
    });
  }

  /**
   * Listen for messages and delegate actions.
   */
  var update = pubsub.subscribe('update', render);
  pubsub.subscribe('kill', function() {
    QIX.app.destroySessionObject(listId);
    pubsub.unsubscribe(update);
  });
  
};