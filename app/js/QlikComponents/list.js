/* global pubsub */
function Tracking(fieldlist, container) {
	
	var cube;
	var $tbody = container.find('tbody');
	var $thead = container.find('thead');
		
	var dimensionList = fieldlist.map(function(d) {
		return {
			"qNullSuppression": false,
			"qDef": {
				"qFieldDefs": [d],
				"qSortCriterias": [{
					"qSortByAscii": 1,				
				}]
			}
		};
	});
		
	QIX.app.createSessionObject({
		"qInfo": {
			"qId": "",
			"qType": "HyperCube"
		},
		"qHyperCubeDef": {
			"qDimensions": dimensionList,
			"qInterColumnSortOrder": [0],
			"qInitialDataFetch": [{
				qTop: 0,
				qLeft: 0,
				qHeight: 1000,
				qWidth: dimensionList.length + 1
			}]
		}
	}).then(function(reply) {
		cube = reply;
		render();
	});
	
	function render() {
		cube.getLayout().then(function(layout) {
			$tbody.empty();
			$thead.empty();		
						
			var $header = $('<tr />');
			
			layout.qHyperCube.qDimensionInfo.forEach(function(d) {
				$('<th>' + d.qFallbackTitle + '</th>').appendTo($header);
			});
			
			$header.appendTo($thead);
						
			layout.qHyperCube.qDataPages[0].qMatrix.some(function(datarow, i) {
				
				var $row = $('<tr/>');
				
				datarow.forEach(function(d, i) {
					if( i == 2) {
						return $('<td><a href="' + d.qText.trim() + '" target="_blank">' + d.qText + '</a></td>').appendTo($row);
					};
					if ( i == 3 ) {
						
						var str = d.qText.split(',').map(function(d) {
							return '<a href="http://www.twitter.com/' + d.trim() + '" target="_blank">' + d + '</a>'
						});
						
						return $('<td>' + str + '</td>').appendTo($row);
					};
					return $('<td>' + d.qText + '</td>').appendTo($row);
				});
				
				$row.appendTo($tbody);
				
			});		
			
		});
	};
	
	var update = pubsub.subscribe('update', render);
	pubsub.subscribe('kill', function() {
		pubsub.unsubscribe(update);
	});
	
};