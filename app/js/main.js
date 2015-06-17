
$('#filter-container').empty();

/* Clear selections in filters */
$('#clearfilter').on('click', function() {
  var $this = $(this);
  $('#qv-search').val('');
  QIX.app.clearAll().then(function() {
    pubsub.publish('update');
  })
})

$('#gettingstarted').click(function() {
  if ($('#splash').hasClass('visible')) {
    $('#splash').slideUp();
    $('#splash').removeClass('visible');
  } else {
    $('#splash').slideDown();
    $('#splash').addClass('visible')
  }
});

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

var contenttable = new ContentTable(['content_type', 'content_type', 'teaser', 'uri', 'entity_name', 'Timestamp', 'entity_name', 'entity_type'], $('.table-tweets'));


/*  Map */
var mapdefinition = [{
  'dim': 'ISO2',
  'label': 'ISO Code'
}, {
  'dim': 'entity_name',
  'label': 'Member State'
}];

var worldmap2 = new WorldMap(mapdefinition, '=Count({<entity_type={"Member State"}>}[AIE_DOCID])', document.getElementById('worldmapsmall'));

/* Wordcloud */
var hashtags = new WordCloud('hashtags', '=Count({<content_type=>}[AIE_DOCID])', document.getElementById('wordcloud'));

/* Tweet Table */
var tweettable = new Table([{
  'dim': 'entity_name',
  'label': 'Member State'
}], {
  'label': 'Number of Tweets',
  'value': '=Count({<entity_type={"Member State"}>}[AIE_DOCID])'
}, document.getElementById('tweettable'));

/* Mentions Table */
var mentions = new Table([{
  'dim': 'mentions',
  'label': 'Mentioned'
}], {
  'label': 'Number of mentions',
  'value': '=Count([AIE_DOCID])'
}, document.getElementById('mentiontable'));

pubsub.subscribe('kill', function() {
  date = null;
  contentType = null;
  orgType = null;
  org = null;
  region = null;
  subregion = null;
})