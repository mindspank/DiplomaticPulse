var Suggestion=function(){"use strict";function t(t){this.$parent=$(t),this.$element=e(this.$parent),this.hasSuggestions=!1}var e=function(t){var e='<div id="suggestions"><ul></ul></div>';return t.after(e)};return t}(),Search=function(){"use strict";function t(t,e){this.$input=$(t),this.q=QIX.app,this.field=e||"teaser",this.minChars=3,this.$nohits=$("#search-nohits"),this.init()}var e={9:"tab",27:"esc",37:"left",39:"right",13:"enter",38:"up",40:"down",32:"space",16:"shift",17:"ctrl"};return t.prototype={_keyup:function(t){return e[t.keyCode]||e[t.which]?!1:(0==t.currentTarget.value.length&&($("#qv-search-clear").hide(),this.$nohits.hide(),this.q.getField(this.field).then(function(t){t.clear().then(function(){$("#main").fadeTo(50,.5).fadeTo(200,1),pubsub.publish("update")})})),t.currentTarget.value.length<this.minChars?!1:($("#qv-search-clear").show(),void this.doSearch(t.target.value)))},bindevents:function(){var t=this;this.$input.on("input",debounce(function(e){t._keyup(e)},250))},doSearch:function(t){var e=this;"="!==t.split("")[0]&&(t=t.split(" ").map(function(t){return"+"+t}).join(" ").trim()),this.listobject.getLayout().then(function(){return e.listobject.searchListObjectFor("/qListObjectDef",t)}).then(function(){return e.listobject.getListObjectData("/qListObjectDef",[{qTop:0,qLeft:0,qWidth:1,qHeight:10}])}).then(function(t){0===t[0].qMatrix.length?pubsub.publish("nodata"):e.listobject.acceptListObjectSearch("/qListObjectDef",!1).then(function(){$("#main").fadeTo(50,.5).fadeTo(200,1),pubsub.publish("update")})})},clear:function(){var t=document.getElementById("qv-search"),e=document.getElementById("qv-search-clear");0!==t.value.length&&(e.style.display="none",this.q.getField(this.field).then(function(e){e.clear().then(function(){t.value="",$("#search-nohits").hide(),$("#main").fadeTo(50,.5).fadeTo(200,1),pubsub.publish("update")})}))},nodata:function(){$("#search-nohits").find("span").text($("#qv-search").val()),$("#search-nohits").show()},init:function(){var t=this;QIX.app.createSessionObject({qInfo:{qId:"",qType:"ListObject"},qSelectionObjectDef:{},qListObjectDef:{qLibraryId:"",qShowAlternatives:!1,qDef:{qFieldDefs:["teaser"]},qInitialDataFetch:[{qTop:0,qHeight:300,qLeft:0,qWidth:1}]}}).then(function(e){t.listobject=e}),this.bindevents();var e=document.getElementById("qv-search-clear");e.addEventListener("click",function(){this.clear()}.bind(this),!1),pubsub.subscribe("nodata",t.nodata)}},t}();