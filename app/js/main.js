/** Empty out any existing filters **/
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

/** 
 * Tweet Table
 */
var contenttable = new ContentTable(['Content Type', 'Entity Name', 'Timestamp', 'teaser', 'Source', 'URL', 'doctype', 'favorites', 'retweets', 'mediaURL'], $('.table-tweets'));


/**
 * Sidebar Map
 */
var mapdefinition = [{
  'dim': 'ISO2',
  'label': 'ISO Code'
}, {
  'dim': 'Entity Name',
  'label': 'Member State'
}];

var worldmap2 = new WorldMap(mapdefinition, '=Sum({<[Entity Type]={"Member State"}>}[ContentCounter])', document.getElementById('worldmapsmall'));

/**
 * Sidebar Wordcloud
 */
var hashtags = new WordCloud('hashtags', 'Sum([HashtagCounter])', document.getElementById('wordcloud'));

/**
 * Sidebar Content Table
 */
var tweettable = new Table([{
  'dim': 'Entity Name',
  'label': 'Member State'
}], {
  'label': 'Web and Tweets',
  'value': '=Sum({<[Entity Type]={"Member State"}>}[ContentCounter])'
}, document.getElementById('tweettable'));

/**
 * Sidebar Mentions Table
 */
var mentions = new Table([{
  'dim': 'mentions',
  'label': 'Mentioned'
}], {
  'label': 'Number of mentions',
  'value': 'Sum(MentionCounter)'
}, document.getElementById('mentiontable'));

/**
 * Sidebar Frequency Chart
 */
var linechart = new Linechart('Date','=Sum({<DateRange=>}ContentCounter)', document.getElementById('linechart'));

/* Clear selections in filters */
$('#clearfilter').on('click', function() {
  var $this = $(this);
  $('#qv-search-clear').hide();
  $('#qv-search').val('');
  QIX.app.clearAll().then(function() {
    //trigger a update
    pubsub.publish('update');
  })
});

/**
 * On Kill signal perform clean up. Kill is triggered on view change/navigation
 */
pubsub.subscribe('kill', function() {
  date = null;
  contentType = null;
  org = null;
  worldmap2 = null;
  tweettable = null;
  mentions = null;
  region = null;
  subregion = null;
  linechart = null;
  combinedFilter = null;
});