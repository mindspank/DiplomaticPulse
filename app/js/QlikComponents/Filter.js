function Filter(field, label, element, shouldsearch) {

  var list;
  var $el = element;
  var existsInDOM = false;
  var selectedState = false;
  var openState = false;
  var searchable = shouldsearch || false;

  var tmpl = '<div id="' + field + '" class="filter">';
  tmpl += '<div class="title">' + label;
  tmpl += '  <div class="right"><div class="count"></div><img src="static/img/toggle.svg"></div>';
  tmpl += '</div>';
  tmpl += '<div class="items"></div>';
  tmpl += '</div>';

  var $div = existsInDOM ? $('#' + field) : $(tmpl);
  var $items = $div.find('.items');
  var $title = $div.find('.title');
  var $count = $div.find('.count');

  $title.on('click', function() {
    $(this).parent().toggleClass('expanded')
  });

  var sort = field == 'DateRange' ? {
    "qSortByNumeric": 1
  } : {
    //"qSortByState": 1,
    "qSortByAsci": 1
  };

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

  function render(data) {
    list.getLayout().then(function(layout) {
      $items.find('ul').remove();
      var items = layout.qListObject.qDataPages[0].qMatrix;
      var selected = layout.qListObject.qDimensionInfo.qStateCounts.qSelected;

      if (selected > 0) {
        selectedState = true;
        $count.visible().text(selected + ' of ' + layout.qListObject.qSize.qcy);
      } else {
        selectedState = false;
        $count.invisible();
      }

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

      if(searchable) searchList();

      $('input.search').val('')

    });
  }

  function searchList() {
    if($('#' + field).find('.search').length === 0 ) {
      $('#' + field).find('.items').before('<input class="search" placeholder="Search list"/>')
    }

    var s = new List(field, {
      valueNames: ['value']
    });
  };

  function select(qElem) {
    list.selectListObjectValues("/qListObjectDef", [+qElem], field == 'DateRange' ? false : true, false).then(function(success) {
      $('#clearfilter').addClass('active');
      pubsub.publish('update')
    })
  }

  var update = pubsub.subscribe('update', render);
  pubsub.subscribe('kill', function() {
    pubsub.unsubscribe(update)
  });
  
};