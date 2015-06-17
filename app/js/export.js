$('#filter-container').empty();

/*
 * Set up Filters
 * @params Field in data model, Label, DOM Element, Search
 */
var container = document.getElementById('filter-container');

var date = Filter('DateRange', 'Time', container);
var contentType = new Filter('content_type', 'Content Type', container);
var orgType = new Filter('entity_type', 'Member Type', container);
var org = new Filter('entity_name', 'Member State', container, true);
var region = new Filter('Region', 'Region', container);
var subregion = new Filter('Sub-Region', 'Sub-Region', container);

var exporttable = new Export(['content_type', 'teaser', 'uri', 'entity_name', 'Timestamp', 'entity_type']);

$('#download').on('click', function(e) {
	e.preventDefault();
	pubsub.publish('export');
});