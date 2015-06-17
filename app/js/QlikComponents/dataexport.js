/* global pubsub */
function Export(fieldlist) {
	
	var cube;
	var $tbody = $('#exporttable tbody');
	var $thead = $('#exporttable thead');
	
	$tbody.empty();
	$thead.empty();
	
	var dimensionList = fieldlist.map(function(d) {
		return {
			"qNullSuppression": true,
			"qDef": {
				"qFieldDefs": [d],
				"qSortCriterias": [{
					"qSortByNumeric": -1
				}]
			}
		};
	});
		
	QIX.app.createSessionObject({
		"qInfo": {
			"qId": "",
			"qType": "ExportHyperCube"
		},
		"qHyperCubeDef": {
			"qDimensions": dimensionList,
			"qInterColumnSortOrder": [0],
			"qInitialDataFetch": [{
				qTop: 0,
				qLeft: 0,
				qHeight: 75,
				qWidth: dimensionList.length + 1
			}]
		}
	}).then(function(reply) {
		cube = reply;
		render();
	});
	
	function render() {
		cube.getLayout().then(function(layout) {
			console.log(layout);
			
			$('.exportarea').first('<p>Showing the first ' + ' rows out of ' + ' available rows.')
			
			var $header = $('<tr />');
			
			layout.qHyperCube.qDimensionInfo.forEach(function(d) {
				$('<th>' + d.qFallbackTitle + '</th>').appendTo($header);
			});
			
			$header.appendTo($thead);
			
			layout.qHyperCube.qDataPages[0].qMatrix.forEach(function(datarow) {
				
				var $row = $('<tr/>');
				
				datarow.forEach(function(d) {
					$('<td>' + d.qText + '</td>').appendTo($row);
				});
				
				$row.appendTo($tbody);
				
			});		
			
		});
	};
	
	function exportData() {
		
		var filename = 'DPExport_' + new Date(Date.now()).toISOString().substring(0,16);
		
		cube.exportData('CSV_C', '/qHyperCubeDef', filename).then(function(reply) {
			$('<a href="#" download="https://' + QIX.config.host + reply + '" id="btnExport" >Export data into Excel</a>').appendTo($('.exportarea'));
		});
			
	};
	
	var doExport = pubsub.subscribe('export', exportData);
	var update = pubsub.subscribe('update', render);
	
};