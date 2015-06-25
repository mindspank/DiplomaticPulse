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
      "qInterColumnSortOrder": [2],
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

      items.forEach(function(d) {
        if (d[1].qIsEmpty) {
          return;
        };
        
        var $row;
        if( d[0].qText === 'Twitter' ) {
          $row = createTweetRow(d);
        } else {
          $row = createWebRow(d);
        };
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
        };
        
        var $row;
        if( d[0].qText === 'Twitter' ) {
          $row = createTweetRow(d);
        } else {
          $row = createWebRow(d);
        };

        $row.appendTo($rows);
        
      });

    })

  };


//'Source', 'URL', 'doctype', 'favorites', 'retweets', 'mediaURL'

  //Return a content row - jquery object
  function createTweetRow(d) {

    var $row = $('<div class="item" />');

    $('<div class="info"><i class="fa fa-twitter"></i>&nbsp;&nbsp;' + d[1].qText + spacer + d[2].qText + '</div>').appendTo($row);
    $('<div class="body">' + d[3].qText + '</div>').appendTo($row);
    
    var detailsTmpl = '<div class="details" style="display: none;"><img style="display: none;width: 100%;"></img><div class="details-bar">';
    detailsTmpl += '<ul><li class="retweet">RETWEETS <strong>' + d[8].qText + '</strong>';
    detailsTmpl += '</li><li class="favorite">FAVORITES <strong>' + d[7].qText + '</strong></li>'
    detailsTmpl += '<li class="handle">TWITTER HANDLE <strong>' + d[4].qText.substring(1) + '</strong></li><li></li></ul>';
    detailsTmpl += '<a target="_blank" href="' + d[5].qText + '">Read on Twitter</a><a target="_blank" href="https://twitter.com/' + d[4].qText + '">View Twitter profile</a></div>';
    
    var $details = $(detailsTmpl);
    
    //mediaUUL
    if(d[9].qText != '-') {
      $row.find('.info').append('<i class="fa fa-picture-o"></i>')
      $details.find('img').attr('src', d[9].qText).show();
    };
    
    $details.appendTo($row);
    
    $row.on('click', function(e) {
      if(e.target.nodeName == 'A') return null;
      $(this).find('.details').slideToggle('fast');
    });
    
    return $row;
  };
  
  //Return a content row - jquery object
  function createWebRow(d) {

    var $row = $('<div class="item" />');

    $('<div class="info"><i class="fa fa-cloud"></i>&nbsp;&nbsp;' + d[1].qText + spacer + d[2].qText.substring(0,17) + '</div>').appendTo($row);
    $('<div class="body">' + d[3].qText + '</div>').appendTo($row);

    var detailsTmpl = '<div class="details" style="display: none;"><div class="details-bar">';
    detailsTmpl += '<ul><li class="documenttype">DOCUMENT TYPE <strong>' + d[6].qText + '</strong></li></ul>';
    detailsTmpl += '<a target="_blank" href="' + d[5].qText + '">Read document</a><a target="_blank" href="//' + d[4].qText + '">Visit source site</a>';
    detailsTmpl += '</div></div>';
    var $details = $(detailsTmpl);
    
    $details.appendTo($row);
    
    $row.on('click', function() {
      $(this).find('.details').slideToggle('fast');
    });
    
    return $row;
  };

  var update = pubsub.subscribe('update', render);
  pubsub.subscribe('kill', function() {
    pubsub.unsubscribe(update);
  });

  //Page on more
  $div.click(function(event) {
    pageData();
  });

};