/** ROUTER **/
/* Add new routes here */
var router = new PathParser();
router.add('home', function () {
  $('#main').load('static/partials/dashboard.html', function() {
    $.getScript('js/main.js');
  });
});

/** Export functionality currently disabled due to bug in QS with anon users and exports **/
router.add('export', function () {
    $('#main').removeClass().addClass('export').load('static/partials/export.html', function() {
       $.getScript('js/export.js')
    });
});

/** If browser does not support window.WebSocket **/
router.add('wsError', function () {
    $('#main').removeClass().addClass('unsupported').load('static/partials/wsError.html', function() {
       $("#sidebar, #search").hide();
    });
});


/** If browser is unsupport let user know. Otherwise set up nav and init app  **/
if( 'WebSocket' in window == false ) {
 router.run("wsError");
} else {

  /** Set up navigation. Append data-nav to your list items.  **/
  $('#navigation li').on('click', function() {
    if($(this).hasClass('active')) return;
    pubsub.publish('kill')
    $('#navigation li').removeClass('active');
    $(this).addClass('active');
    router.run($(this).data('nav'))
  });
  
  /** QSOCKS CONFIGS  **/
  /** config object needs to be changed to match Qlik Sense host.  **/
  var QIX = {
    global: null,
    app: null,
    config: {
      host: 'diplomaticpulse.qlik.com',
      isSecure: true,
      appname: 'b7e0c43f-e6bf-4c80-99fc-2ed79cd91337'
    },
    connect: function(cb) {
  
      var config = this.config;
  
      qsocks.Connect(config).then(function(g) {
        QIX.global = g;
        g.openDoc(config.appname).then(function(a) {
          QIX.app = a;
          a.clearAll().then(cb)
        })
      }, function(error) {
        console.log(error)
      });
    }
  };
  
  /** App Entry Point **/
  QIX.connect(function() {
    router.run('home');
    
    /** Resize **/
    $(window).on('resize', debounce(function() {
      pubsub.publish('resize');
    }, 500));
    
    /** INTRO MODAL **/
    if( !Intro.getData() ) {
      Intro.show();
    };
    
    $('.openintro').on('click', function() {
      Intro.show();
    });
    
    $('#modal-toggle').on('click', function() {
      if( $('#dontshow').is(':checked') ) {
        Intro.setData(true);
      } else {
        Intro.setData(false);
      };
      Intro.hide();
    });
    
    $('#menu-button').on('click touchend', function() {
      $('#sidebar').toggle();
    });
        
    //Set up Search
    var input = new Search($('#qv-search'));
    
  });
};