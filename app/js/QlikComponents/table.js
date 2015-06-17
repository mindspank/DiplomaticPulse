function Table(dimensions, expression, element) {

	var cube, max;

	var dimensionList = dimensions.map(function(d) {
		return {
			"qNullSuppression": true,
			"qDef": {
				"qFieldDefs": [d.dim],
				"qFieldLabels": [d.label],
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
			"qMeasures": [{
				"qLibraryId": "",
				"qSortBy": {
					"qSortByNumeric": -1
				},
				"qDef": {
					"qLabel": expression.label,
					"qDescription": "",
					"qDef": expression.value
				}
			}],
			"qInterColumnSortOrder": [1, 0],
			"qInitialDataFetch": [{
				qTop: 0,
				qLeft: 0,
				qHeight: 10,
				qWidth: dimensionList.length + 1
			}]
		}
	}).then(function(reply) {
		cube = reply;
		render();
	});

	function render() {
		cube.getLayout().then(function(layout) {
			$(element).empty();

			var $table = $('<table />');
			var $thead = createHeader(layout);
			var $tbody = $('<tbody />');

			max = d3.max(layout.qHyperCube.qDataPages[0].qMatrix, function(d) {
				return d[1].qNum;
			});

			layout.qHyperCube.qDataPages[0].qMatrix.forEach(function(d) {
				var row = createRow(d);
				row.appendTo($tbody);
			});

			$thead.appendTo($table)
			$tbody.appendTo($table)
			$table.appendTo($(element));

		}, function(error) {
			console.log(error)
		});
	}

	//Return a content row - jquery object
	function createRow(d) {

		var perc = (d[1].qNum / max) * 100;

		var $row = $('<tr/>');
		$('<td id="' + d[0].qElemNumber + '" class="col col1">' + d[0].qText + '</td>').click(function(event) {
			select(+$(this).attr('id'));
		}).appendTo($row);
		$('<td class="col col2"><div style="width:' + perc + '%;"></div></td>').appendTo($row);
		$('<td class="col col3">' + d[1].qNum + '</td>').appendTo($row);

		return $row;
	}

	function createHeader(layout) {

		var columns = [],
			$thead = $('<thead />');

		layout.qHyperCube.qDimensionInfo.forEach(function(d) {
			columns.push(capitalizeFirstLetter(d.qFallbackTitle));
		})

		columns.push(layout.qHyperCube.qMeasureInfo[0].qFallbackTitle);

		columns.forEach(function(d, i) {
			if (i == 1) {
				$('<th colspan="2" class="col col' + (i + 1) + '">' + d + '</th>').appendTo($thead);
			} else {
				$('<th class="col col' + (i + 1) + '">' + d + '</th>').appendTo($thead);
			}
		})
		return $thead;
	}

	function select(qElem) {
		cube.selectHyperCubeValues('/qHyperCubeDef', 0, [qElem], true).then(function(success) {
			pubsub.publish('update');
		})
	}

	function capitalizeFirstLetter(string) {
		return string.charAt(0).toUpperCase() + string.slice(1);
	}


	pubsub.subscribe('update', render);

};