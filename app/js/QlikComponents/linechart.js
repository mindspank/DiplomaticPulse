function Linechart(dimension, expression, element) {

	var cube,
		data,
		width,
		height,
		y,
		x,
		xAxis,
		yAxis,
		line,
		svg,
		g;

	var parseDate = d3.time.format("%Y-%m-%d").parse;

	var margin = {top: 20, right: 20, bottom: 30, left: 30};

	width = element.offsetWidth - margin.left - margin.right;
	height = (width / 1.2) - margin.top - margin.bottom;
	
	svg = d3.select(element).append("svg").attr("id", "linechart");
	
	QIX.app.createSessionObject({
		"qInfo": {
			"qId": "",
			"qType": "HyperCube"
		},
		"qHyperCubeDef": {
			"qDimensions": [{
				"qNullSuppression": true,
				"qDef": {
					"qFieldDefs": [dimension],
					"qFieldLabels": ['Test'],
					"qSortCriterias": [{
						"qSortByNumeric": -1
					}]
				}
			}],
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
			"qSuppressMissing": true,
			"qSuppressZero": true,
			"qInterColumnSortOrder": [0, 1],
			"qInitialDataFetch": [{
				qTop: 0,
				qLeft: 0,
				qHeight: 30,
				qWidth: 2
			}]
		}
	}).then(function(reply) {
		cube = reply;
		render();
	});	

	function render() {
		
		svg.selectAll('*').remove();
		
		x = d3.time.scale()
	    	.range([0, width]);
	
		y = d3.scale.linear()
		    .range([height, 0])
			.nice();
		
		xAxis = d3.svg.axis()
		    .scale(x)
			.ticks(3)
		    .orient("bottom");
		
		yAxis = d3.svg.axis()
		    .scale(y)
			.tickFormat(d3.format("s"))
		    .orient("left");
		
		line = d3.svg.line()
		    .x(function(d) { return x(d.date); })
		    .y(function(d) { return y(d.value); });

		svg.attr('width', width + margin.left + margin.right).attr('height', height + margin.top + margin.bottom);
		g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
			
		cube.getLayout().then(function(layout) {
			svg.selectAll('path, .axis, .error').remove();
			if (layout.qHyperCube.qSize.qcy < 4) {

				svg.append('text')
					.attr('class', 'error')
					.attr("text-anchor", "middle")
					.attr("transform", function(d) {
						return "translate(" + [element.offsetWidth / 2, element.offsetHeight / 2] + ")";
					})
					.style("font-size", '16px')
					.style("fill", 'rgb(39, 48, 81)')
					.text('Not Enough Content Available');
				
				return null;
			};
			
			var data = layout.qHyperCube.qDataPages[0].qMatrix.filter(function(d) {
				return d[0].qText.length && +d[1].qNum === (+d[1].qNum | 0);
			}).map(function(d) {
				return {
					date: parseDate(d[0].qText),
					value: d[1].qNum	
				};
			},[]).sort(function(a,b) {
				return a.date - b.date;
			});
			
			
			x.domain(d3.extent(data, function(d) { return d.date; }));
			y.domain(d3.extent(data, function(d) { return d.value; }));
			
			g.append("g")
			  .attr("class", "x axis")
			  .attr("transform", "translate(0," + height + ")")
			  .call(xAxis);
			
			g.append("g")
			  .attr("class", "y axis")
			  .call(yAxis);
			  
			g.append("path")
			  .datum(data)
			  .attr("class", "line")
			  .attr("d", line)
			  .style('fill', 'none')
			  .style('stroke', '#273051')
			  .style('stroke-width', '3px');

		});
	};

	function resize() {
		
		width = element.offsetWidth - margin.left - margin.right;
		height = (width / 1.2) - margin.top - margin.bottom;
		
		render();
	};

	var update = pubsub.subscribe('update', render);
	var resizeEvent = pubsub.subscribe('resize', resize);
	
	pubsub.subscribe('kill', function() {
		pubsub.unsubscribe(update);
		pubsub.unsubscribe(resizeEvent);
	});

};