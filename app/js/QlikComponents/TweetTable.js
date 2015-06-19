function ContentTable(fieldlist, element) {

  var cube;
  var index = 0;
  var visibleItems = 0;
  var qHeightValue = 30;
  var maxIdx;
  var $div = $('#more');
  var $rows = element.find('.rows');
  var spacer = '&nbsp;&nbsp;-&nbsp;&nbsp;';

  var dimensionList = fieldlist.map(function(d) {
    return {
      //"qNullSuppression": true,
      "qDef": {
        "qFieldDefs": [d],
        "qSortCriterias": [{
          "qSortByNumeric": -1
        }]
      }
    }
  });

  QIX.app.createSessionObject({
    "qInfo": {
      "qId": "",
      "qType": "HyperCube"
    },
    "qHyperCubeDef": {
      "qDimensions": dimensionList,
      "qInterColumnSortOrder": [5],
      "qInitialDataFetch": [{
          qTop: 0,
          qLeft: 0,
          qHeight: qHeightValue,
          qWidth: dimensionList.length + 1
        }]
    }
  }).then(function(reply) {
    cube = reply;
    render();
  });

  function render() {
    cube.getLayout().then(function(layout) {
      if (layout.qHyperCube.qDataPages[0].qMatrix.length < qHeightValue) {
        $div.hide();
      } else {
        $div.show();
      }

      maxIdx = layout.qHyperCube.qSize.qcy;

      $rows.empty();

      var items = layout.qHyperCube.qDataPages[0].qMatrix;

      items.forEach(function(column) {
        if (column[1].qIsEmpty) {
          return;
        }
        var $row = createRow(column);
        $row.appendTo($rows);
      });

    }, function(error) {
      console.log(error)
    });
  }

  function pageData() {
    index += qHeightValue;

    var pages = {
      qTop: index,
      qLeft: 0,
      qHeight: qHeightValue,
      qWidth: dimensionList.length + 1
    }

    //For some reason pages has to wrapped in a array
    cube.getHyperCubeData('/qHyperCubeDef', [pages]).then(function(data) {

      if (data[0].qMatrix.length < qHeightValue) {
        $('#more').hide();
      }

      data[0].qMatrix.forEach(function(d) {
        if (d[1].qIsEmpty) {
          return;
        }
        var $row = createRow(d);
        $row.appendTo($rows);
      })

    })

  };


  //Return a content row - jquery object
  function createRow(d) {

    var $row = $('<div class="item" />');
    var type = d[0].qText == 'Web' ? 'fa-cloud' : 'fa-twitter';

    $('<div class="info"><i class="fa '+ type + '"></i>&nbsp;&nbsp;' + d[4].qText + spacer + d[5].qText.substring(0,16) + '</div>').appendTo($row);
    $('<div class="body">' + d[2].qText + '</div>').appendTo($row);

    return $row;
  };

  var update = pubsub.subscribe('update', render);
  pubsub.subscribe('kill', function() {
    pubsub.unsubscribe(update)
  });

  //Page on more
  $div.click(function(event) {
    pageData();
  });

};