var router=new PathParser;if(router.add("home",function(){$("#main").load("static/partials/dashboard.html",function(){$.getScript("js/main.js")})}),router.add("trackinglist",function(){$("#main").removeClass().addClass("trackinglist").load("static/partials/trackinglist.html",function(){$.getScript("js/trackinglist.js")})}),router.add("export",function(){$("#main").removeClass().addClass("export").load("static/partials/export.html",function(){$.getScript("js/export.js")})}),router.add("wsError",function(){$("#top-controls").remove(),$("#main").removeClass().addClass("unsupported").load("static/partials/wsError.html",function(){$("#sidebar, #search").hide()})}),"WebSocket"in window==0)router.run("wsError");else{$("#navigation li").on("click",function(){$(this).hasClass("active")||(pubsub.publish("kill"),$("#navigation li").removeClass("active"),$(this).addClass("active"),router.run($(this).data("nav")))});var QIX={global:null,app:null,config:{host:"diplomaticpulse.qlik.com",isSecure:!0,appname:"b7e0c43f-e6bf-4c80-99fc-2ed79cd91337"},connect:function(t){var n=this.config;qsocks.Connect(n).then(function(o){QIX.global=o,o.openDoc(n.appname).then(function(n){QIX.app=n,n.clearAll().then(function(){n.getField("DateRange").then(function(n){n.selectValues([{qText:"Last 24 hours"}],!0).then(t)})})})},function(t){console.log(t)})}};QIX.connect(function(){router.run("home"),$(window).on("resize",debounce(function(){pubsub.publish("resize")},500)),Intro.getData()||Intro.show(),$(".openintro").on("click",function(){Intro.show()}),$("#modal-toggle").on("click",function(){$("#dontshow").is(":checked")?Intro.setData(!0):Intro.setData(!1),Intro.hide()}),$("#menu-button").on("click",function(){$("#sidebar").toggle()});new Search($("#qv-search"))})}