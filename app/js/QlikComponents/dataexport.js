function Export(fieldlist) {
	
	var cube;
	
	var dimensionList = fieldlist.map(function(d) {
		return {
			"qNullSuppression": true,
			"qDef": {
				"qFieldDefs": [d.dim],
				"qFieldLabels": [d.label],
				"qSortCriterias": [{
					"qSortByNumeric": -1
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
				qHeight: 200,
				qWidth: dimensionList.length + 1
			}]
		}
	}).then(function(reply) {
		cube = reply;
		render();
	});
	
	function render() {
		cube.getLayout().then(function() {
			console.log(layout);
		});
	};
	
	pubsub.subscribe('update', render);
	
}