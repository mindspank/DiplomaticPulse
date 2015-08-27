$('#filter-container').empty();

/*
 * Set up Filters
 * @params Field in data model, Label, DOM Element, Search
 */
var container = document.getElementById('filter-container');
var date = new Filter('DateRange', 'Time', container);
var contentType = new Filter('Content Type', 'Content Type', container);
var region = new Filter('Region', 'Region', container);
var subregion = new Filter('Sub-Region', 'Sub-Region', container);

var combinedFilter = new UNFilter(container);

var trackingtable = new Tracking(['[Entity Name]', '[Entity Type]', '[Entity URL]', '[Entity Twitter Handles]'], $('.trackingarea'));

/**
 * On Kill signal perform clean up. Kill is triggered on view change/navigation
 */
pubsub.subscribe('kill', function() {
  contentType = null;
  container = null;
  trackingtable = null;
  org = null;
  orgType = null;
  region = null;
  subregion = null;
  combinedFilter = null;
});