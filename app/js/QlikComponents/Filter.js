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


function Filter(field, label, element, shouldsearch) {

  var list;
  var listId;
  var $el = element;
  var existsInDOM = false;
  var selectedState = false;
  var openState = false;
  var searchable = shouldsearch || false;
  var labeltrim = label.replace(/\s+/g, '').replace(/\./g, '');

  /**
   * Filter HTML template
   */
  var tmpl = '<div id="' + labeltrim + '" class="filter">';
  tmpl += '<div class="title">' + label;
  tmpl += '  <div class="right"><div class="count"></div><img src="static/img/toggle.svg"></div>';
  tmpl += '</div>';
  tmpl += '<div class="items"></div>';
  tmpl += '</div>';

  var $div = existsInDOM ? $('#' + labeltrim) : $(tmpl);
  var $items = $div.find('.items');
  var $title = $div.find('.title');
  var $count = $div.find('.count');

  /**
   * Expand Filter on click.
   */
  $title.on('click', function() {
    $(this).parent().toggleClass('expanded')
  });

  /**
   * Sort Filters alphabetically unless it's a date filter.
   */
  var sort = field == 'DateRange' ? {
    "qSortByNumeric": 1
  } : {
    //"qSortByState": 1,
    "qSortByAsci": 1
  };

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
      "qDef": {
        "qFieldDefs": [field],
        "qSortCriterias": [sort]
      },
      "qInitialDataFetch": [{
        "qTop": 0,
        "qHeight": 300,
        "qLeft": 0,
        "qWidth": 1
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
       
      $items.find('ul').remove();
      
      var items = layout.qListObject.qDataPages[0].qMatrix;
      var selected = layout.qListObject.qDimensionInfo.qStateCounts.qSelected;

      /**
       * Show/Hide selected counter based on data
       */
      if (selected > 0) {
        selectedState = true;
        $count.visible().text(selected + ' of ' + layout.qListObject.qSize.qcy);
      } else {
        selectedState = false;
        $count.invisible();
      }

      /**
       * Append list items, data-elem contains the Qlik Sense Index to be selected on the data model on click.
       */
      var $ul = $('<ul class="list" />');
      $ul.html(items.map(function(d) {
        return '<li data-elem="' + d[0].qElemNumber + '" class="' + d[0].qState + ' listitem"><p class="value">' + d[0].qText + '</p></li>'
      }));

      $ul.find('li').on('click', function() {
        select($(this).attr('data-elem'))
      })

      $ul.appendTo($items);
      if (!existsInDOM) {
        $div.appendTo(element);
        existsInDOM = true;
      };
      
      /**
       * If Filter should be searchable instanciate List.js
       */
      if(searchable) searchList();

      $('input.search').val('')

    });
  }

  /**
   * Set up searchable lists using List.js
   */
  function searchList() {
    if($('#' + labeltrim).find('.search').length === 0 ) {
      $('#' + labeltrim).find('.items').before('<input class="search" placeholder="Search list"/>')
    }

    var s = new List(document.getElementById(labeltrim), {
      valueNames: ['value']
    });
  };

  /**
   * Select a value in the Qlik Sense Data Model.
   * Will trigger a update message to notify other objects to update accordingly.
   */
  function select(qElem) {
    list.selectListObjectValues("/qListObjectDef", [+qElem], field == 'DateRange' ? false : true, false).then(function(success) {
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