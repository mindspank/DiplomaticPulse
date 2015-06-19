(function(global) {
  
  var Intro = (function() {
    
    var keyName = 'qShowIntro';
    var hasKey = localStorage.hasOwnProperty(keyName);

    return {
      keyName: keyName,
      getData: function() {
        if(!localStorage.hasOwnProperty(keyName)) {
          localStorage.setItem(keyName, 'true');
        }; 
        return JSON.parse(localStorage.getItem(keyName));
      },
      setData: function( value ) {
        return localStorage.setItem(keyName, value.toString());
      },
      show: function() {
        if(global.matchMedia("(max-width: 675px)").matches) return;
        $('#intro').css('display', 'flex').animate({
          opacity: 1
        }, 'fast');
      },
      hide: function() {
        $('#intro').animate({
          opacity: 0
        }, 'fast', function() {
          $('#intro').css('display','none');
        });
      }
    };
  })();
  
  global.Intro = Intro;
    
}(this));