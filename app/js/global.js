(function($) {
    $.fn.invisible = function() {
        return this.each(function() {
            $(this).css("visibility", "hidden");
        });
    };
    $.fn.visible = function() {
        return this.each(function() {
            $(this).css("visibility", "visible");
        });
    };
}(jQuery));

function debounce(func, wait, immediate) {
  var timeout;
  return function() {
    var context = this,
      args = arguments;
    var later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
};

/** ROUTER **/

var router = new PathParser();
router.add('home', function () {
  $('#main').load('static/partials/dashboard.html', function() {
    $.getScript('js/main.js');
  });
});
router.add('profile', function () {
    $('#main').load('static/partials/profile.html');
});
router.add('export', function () {
    $('#main').removeClass().addClass('export').load('static/partials/export.html', function() {
       $.getScript('js/export.js')
    });
});

$('#navigation li').on('click', function() {
  if($(this).hasClass('active')) return;
  pubsub.publish('kill')
  $('#navigation li').removeClass('active');
  $(this).addClass('active');
  router.run($(this).data('nav'))
})


var QIX = {
  global: null,
  app: null,
  config: {
    host: 'diplomaticpulse.qlik.com',
    isSecure: true,
    appname: 'cb5bd147-7d74-4edd-9e2a-1d16e63906ae'
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
    })
  }
};

QIX.connect(function() {
  router.run('home');
});

/* Resize */
$(window).on('resize', _.debounce(function() {
  pubsub.publish('resize');
}, 500));
