function WorldMap(dimensions, expression, element) {

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

	var cube, geo, b, s, t, projection, path, data = {},
		qHeightValue = 500,
		index = 0,
		width,
		height;

	width = element.offsetWidth;
	height = width / 1.5;

	projection = d3.geo.mercator()
		.scale(1)
		.translate([0, 0]);

	path = d3.geo.path().projection(projection);

	var svg = d3.select(element).append("svg")
		.attr('width', width)
		.attr('height', height);

	var tip = d3.tip()
		.attr('class', 'd3-tip')
		.offset([-10, 0])
		.html(function(d) {
			return "<span>" + data[d.id].name + ": " + data[d.id].value + " </span>";
		})

	svg.call(tip)

	d3.json("/static/data/world.geo.json", function(error, world) {
		if (error) return console.error(error);

		geo = world;

		b = path.bounds(geo),
			s = .95 / Math.max((b[1][0] - b[0][0]) / width, (b[1][1] - b[0][1]) / height),
			t = [(width - s * (b[1][0] + b[0][0])) / 2, (height - s * (b[1][1] + b[0][1])) / 2];

		projection
			.scale(s)
			.translate(t);

		svg.selectAll('path').
		data(world.features)
			.enter()
			.append('path')
			.attr('d', path);

		init();

	})

	function init() {
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
						"qLabel": "",
						"qDescription": "",
						"qDef": expression
					}
				}],
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
	}

	function render() {
		cube.getLayout().then(function(layout) {

			svg.selectAll('circle').remove();

			var max = layout.qHyperCube.qMeasureInfo[0].qMax;
			var min = layout.qHyperCube.qMeasureInfo[0].qMin;

			var radius;

			if( width < 300) {
				radius = d3.scale.sqrt().domain([min, max]).range([0, 15]);
			} else {
				radius = d3.scale.sqrt().domain([min, max]).range([0, 25]);
			};

			data = {};

			layout.qHyperCube.qDataPages[0].qMatrix.forEach(function(d) {
				data[d[0].qText] = {
					value: d[2].qNum,
					name: d[1].qText,
					elem: d[0].qElemNumber
				}
			})



			var circledata = geo.features.filter(function(b) {
				return data.hasOwnProperty(b.id)
			})

			svg.selectAll("circle")
				.attr("class", "bubble")
				.data(circledata)
				.enter()
				.append("circle")
				.attr("cx", function(d) {
					return path.centroid(d)[0];
				})
				.attr("cy", function(d) {
					return path.centroid(d)[1];
				})
				.attr("r", function(d) {
					if(layout.qHyperCube.qDataPages[0].qMatrix.length == 1) {
						return 10;	
					};
					return radius(data[d.id].value);
				})
				.on('mouseover', tip.show)
				.on('mouseout', tip.hide)
				.on('click', function(d, e) {
					select(data[d.id].elem);
				});

		})
	};

	function resize() {
		svg.selectAll('path, circle').remove();
		
		width = element.offsetWidth;
		height = width / 1.5;
		
		svg.attr('width', width).attr('height', height);

		projection = d3.geo.mercator()
		.scale(1)
		.translate([0, 0]);

		path = d3.geo.path().projection(projection);

		b = path.bounds(geo),
			s = .95 / Math.max((b[1][0] - b[0][0]) / width, (b[1][1] - b[0][1]) / height),
			t = [(width - s * (b[1][0] + b[0][0])) / 2, (height - s * (b[1][1] + b[0][1])) / 2];

		projection
			.scale(s)
			.translate(t);

		svg.selectAll('path').
			data(geo.features)
			.enter()
			.append('path')
			.attr('d', path);

		render();
	}

	function select(qElem) {
		cube.selectHyperCubeValues('/qHyperCubeDef', 0, [qElem], true).then(function(success) {
			pubsub.publish('update');
		});
	};

	var update = pubsub.subscribe('update', render);
	var resizeEvent = pubsub.subscribe('resize', resize);
	
	pubsub.subscribe('kill', function() {
		pubsub.unsubscribe(update);
		pubsub.unsubscribe(resizeEvent);
	});
  
};