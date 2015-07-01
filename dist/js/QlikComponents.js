function Export(e){function t(){a.getLayout().then(function(e){i.empty(),r.empty();var t=$("<tr />");e.qHyperCube.qDimensionInfo.forEach(function(e){$("<th>"+e.qFallbackTitle+"</th>").appendTo(t)}),t.appendTo(r),e.qHyperCube.qDataPages[0].qMatrix.some(function(e,t){var n=$("<tr/>");return e.forEach(function(e){$("<td>"+e.qText+"</td>").appendTo(n)}),n.appendTo(i),75===t})})}function n(){var e="DPExport_"+new Date(Date.now()).toISOString().substring(0,16);a.exportData("CSV_C","/qHyperCubeDef",e).then(function(e){window.open("https://"+QIX.config.host+e,"_blank")})}var a,i=$("#exporttable tbody"),r=$("#exporttable thead"),s=e.map(function(e){return{qNullSuppression:!0,qDef:{qFieldDefs:[e],qSortCriterias:[{qSortByNumeric:-1}]}}});QIX.app.createSessionObject({qInfo:{qId:"",qType:"ExportHyperCube"},qHyperCubeDef:{qDimensions:s,qInterColumnSortOrder:[0],qInitialDataFetch:[{qTop:0,qLeft:0,qHeight:500,qWidth:s.length+1}]}}).then(function(e){a=e,t()});pubsub.subscribe("export",n),pubsub.subscribe("update",t)}function Filter(e,t,n,a){function i(){o.getLayout().then(function(e){u=e.qInfo.qId,b.find("ul").remove();var t=e.qListObject.qDataPages[0].qMatrix,a=e.qListObject.qDimensionInfo.qStateCounts.qSelected;a>0?(c=!0,m.visible().text(a+" of "+e.qListObject.qSize.qcy)):(c=!1,m.invisible());var i=$('<ul class="list" />');i.html(t.map(function(e){return'<li data-elem="'+e[0].qElemNumber+'" class="'+e[0].qState+' listitem"><p class="value">'+e[0].qText+"</p></li>"})),i.find("li").on("click",function(){s($(this).attr("data-elem"))}),i.appendTo(b),l||(f.appendTo(n),l=!0),p&&r(),$("input.search").val("")})}function r(){0===$("#"+q).find(".search").length&&$("#"+q).find(".items").before('<input class="search" placeholder="Search list"/>');new List(document.getElementById(q),{valueNames:["value"]})}function s(t){o.selectListObjectValues("/qListObjectDef",[+t],"DateRange"==e?!1:!0,!1).then(function(e){$("#clearfilter").addClass("active"),pubsub.publish("update")},function(e){console.log(e)})}var o,u,l=!1,c=!1,p=a||!1,q=t.replace(/\s+/g,"").replace(/\./g,""),d='<div id="'+q+'" class="filter">';d+='<div class="title">'+t,d+='  <div class="right"><div class="count"></div><img src="static/img/toggle.svg"></div>',d+="</div>",d+='<div class="items"></div>',d+="</div>";var f=$(l?"#"+q:d),b=f.find(".items"),h=f.find(".title"),m=f.find(".count");h.on("click",function(){$(this).parent().toggleClass("expanded")});var g="DateRange"==e?{qSortByNumeric:1}:{qSortByAsci:1};QIX.app.createSessionObject({qInfo:{qId:"",qType:"ListObject"},qListObjectDef:{qLibraryId:"",qDef:{qFieldDefs:[e],qSortCriterias:[g]},qInitialDataFetch:[{qTop:0,qHeight:300,qLeft:0,qWidth:1}]}}).then(function(e){o=e,i()});var y=pubsub.subscribe("update",i);pubsub.subscribe("kill",function(){QIX.app.destroySessionObject(u),pubsub.unsubscribe(y)})}function Linechart(e,t,n){function a(){r.getLayout().then(function(e){return f.selectAll("path, .axis, .error").remove(),e.qHyperCube.qSize.qcy<4?(f.append("text").attr("class","error").attr("text-anchor","middle").attr("transform",function(e){return"translate("+[n.offsetWidth/2,n.offsetHeight/2]+")"}).style("font-size","16px").style("fill","rgb(39, 48, 81)").text("Not Enough Content Available"),null):(s=e.qHyperCube.qDataPages[0].qMatrix.filter(function(e){return e[0].qText.length&&+e[1].qNum===(0|+e[1].qNum)}).map(function(e){return{date:h(e[0].qText),value:e[1].qNum}},[]).sort(function(e,t){return e.date-t.date}),c.domain(d3.extent(s,function(e){return e.date})),l.domain(d3.extent(s,function(e){return e.value})),b.append("g").attr("class","x axis").attr("transform","translate(0,"+u+")").call(p),b.append("g").attr("class","y axis").call(q),void b.append("path").datum(s).attr("class","line").attr("d",d).style("fill","none").style("stroke","#273051").style("stroke-width","3px"))})}function i(){f.selectAll("path, g").remove(),b=f.append("g").attr("transform","translate("+m.left+","+m.top+")"),o=n.offsetWidth-m.left-m.right,u=o/1.2-m.top-m.bottom,c=d3.time.scale().range([0,o]),l=d3.scale.linear().range([u,0]),p=d3.svg.axis().scale(c).ticks(3).orient("bottom"),q=d3.svg.axis().scale(l).ticks(3).orient("left"),f.attr("width",o+m.left+m.right).attr("height",u+m.top+m.bottom),a()}var r,s,o,u,l,c,p,q,d,f,b,h=d3.time.format("%Y-%m-%d").parse,m={top:20,right:20,bottom:30,left:40};o=n.offsetWidth-m.left-m.right,u=o/1.2-m.top-m.bottom,c=d3.time.scale().range([0,o]),l=d3.scale.linear().range([u,0]),p=d3.svg.axis().scale(c).ticks(3).orient("bottom"),q=d3.svg.axis().scale(l).ticks(3).orient("left"),d=d3.svg.line().x(function(e){return c(e.date)}).y(function(e){return l(e.value)}),f=d3.select(n).append("svg").attr("width",o+m.left+m.right).attr("height",u+m.top+m.bottom),b=f.append("g").attr("transform","translate("+m.left+","+m.top+")"),QIX.app.createSessionObject({qInfo:{qId:"",qType:"HyperCube"},qHyperCubeDef:{qDimensions:[{qNullSuppression:!0,qDef:{qFieldDefs:[e],qFieldLabels:["Test"],qSortCriterias:[{qSortByNumeric:-1}]}}],qMeasures:[{qLibraryId:"",qSortBy:{qSortByNumeric:-1},qDef:{qLabel:"",qDescription:"",qDef:t}}],qSuppressMissing:!0,qSuppressZero:!0,qInterColumnSortOrder:[0,1],qInitialDataFetch:[{qTop:0,qLeft:0,qHeight:30,qWidth:2}]}}).then(function(e){r=e,a()});var g=pubsub.subscribe("update",a);pubsub.subscribe("kill",function(){pubsub.unsubscribe(g)}),pubsub.subscribe("resize",i)}function Table(e,t,n){function a(){u.getLayout().then(function(e){if($(n).empty(),e.qHyperCube.qDataPages[0].qMatrix[0][0].qIsEmpty)return $("<p>No Mentions Available</p>").appendTo($(n));var t=$("<table />"),a=r(e),s=$("<tbody />");l=d3.max(e.qHyperCube.qDataPages[0].qMatrix,function(e){return e[1].qNum}),e.qHyperCube.qDataPages[0].qMatrix.forEach(function(e){var t=i(e);t.appendTo(s)}),a.appendTo(t),s.appendTo(t),t.appendTo($(n))},function(e){console.log(e)})}function i(e){var t=e[1].qNum/l*100,n=$("<tr/>");return $('<td id="'+e[0].qElemNumber+'" class="col col1">'+e[0].qText+"</td>").click(function(e){s(+$(this).attr("id"))}).appendTo(n),$('<td class="col col2"><div style="width:'+t+'%;"></div></td>').appendTo(n),$('<td class="col col3">'+e[1].qNum+"</td>").appendTo(n),n}function r(e){var t=[],n=$("<thead />");return e.qHyperCube.qDimensionInfo.forEach(function(e){t.push(o(e.qFallbackTitle))}),t.push(e.qHyperCube.qMeasureInfo[0].qFallbackTitle),t.forEach(function(e,t){1==t?$('<th colspan="2" class="col col'+(t+1)+'">'+e+"</th>").appendTo(n):$('<th class="col col'+(t+1)+'">'+e+"</th>").appendTo(n)}),n}function s(e){u.selectHyperCubeValues("/qHyperCubeDef",0,[e],!0).then(function(e){pubsub.publish("update")})}function o(e){return e.charAt(0).toUpperCase()+e.slice(1)}var u,l,c=e.map(function(e){return{qNullSuppression:!0,qDef:{qFieldDefs:[e.dim],qFieldLabels:[e.label],qSortCriterias:[{qSortByNumeric:-1}]}}});QIX.app.createSessionObject({qInfo:{qId:"",qType:"HyperCube"},qHyperCubeDef:{qDimensions:c,qMeasures:[{qLibraryId:"",qSortBy:{qSortByNumeric:-1},qDef:{qLabel:t.label,qDescription:"",qDef:t.value}}],qSuppressMissing:!0,qSuppressZero:!0,qInterColumnSortOrder:[1,0],qInitialDataFetch:[{qTop:0,qLeft:0,qHeight:10,qWidth:c.length+1}]}}).then(function(e){u=e,a()});var p=pubsub.subscribe("update",a);pubsub.subscribe("kill",function(){pubsub.unsubscribe(p)})}function ContentTable(e,t){function n(){s.getLayout().then(function(e){e.qHyperCube.qDataPages[0].qMatrix.length<l?c.hide():c.show(),o=e.qHyperCube.qSize.qcy,p.empty();var t=e.qHyperCube.qDataPages[0].qMatrix;t.forEach(function(e){if(!e[1].qIsEmpty){var t;t="Twitter"===e[0].qText?i(e):r(e),t.appendTo(p)}})},function(e){console.log(e)})}function a(){u+=l;var e={qTop:u,qLeft:0,qHeight:l,qWidth:d.length+1};s.getHyperCubeData("/qHyperCubeDef",[e]).then(function(e){e[0].qMatrix.length<l&&$("#more").hide(),e[0].qMatrix.forEach(function(e){if(!e[1].qIsEmpty){var t;t="Twitter"===e[0].qText?i(e):r(e),t.appendTo(p)}})})}function i(e){var t=$('<div class="item" />');$('<div class="info"><i class="fa fa-twitter"></i>&nbsp;&nbsp;'+e[1].qText+q+e[2].qText+"</div>").appendTo(t),$('<div class="body">'+e[3].qText+"</div>").appendTo(t);var n='<div class="details" style="display: none;"><img style="display: none;width: 100%;"></img><div class="details-bar">';n+='<ul><li class="retweet">RETWEETS <strong>'+e[8].qText+"</strong>",n+='</li><li class="favorite">FAVORITES <strong>'+e[7].qText+"</strong></li>",n+='<li class="handle">TWITTER HANDLE <strong>'+e[4].qText.substring(1)+"</strong></li><li></li></ul>",n+='<a target="_blank" href="'+e[5].qText+'">Read on Twitter</a><a target="_blank" href="https://twitter.com/'+e[4].qText+'">View Twitter profile</a></div>';var a=$(n);return"-"!=e[9].qText&&(t.find(".info").append('<i class="fa fa-picture-o"></i>'),a.find("img").attr("src",e[9].qText).show()),a.appendTo(t),t.on("click",function(e){return"A"==e.target.nodeName?null:void $(this).find(".details").slideToggle("fast")}),t}function r(e){var t=$('<div class="item" />');$('<div class="info"><i class="fa fa-cloud"></i>&nbsp;&nbsp;'+e[1].qText+q+e[2].qText+"</div>").appendTo(t),$('<div class="body">'+e[3].qText+"</div>").appendTo(t);var n='<div class="details" style="display: none;"><div class="details-bar">';n+='<ul><li class="documenttype">DOCUMENT TYPE <strong>'+e[6].qText+"</strong></li></ul>",n+='<a target="_blank" href="'+e[5].qText+'">Read document</a><a target="_blank" href="//'+e[4].qText+'">Visit source site</a>',n+="</div></div>";var a=$(n);return a.appendTo(t),t.on("click",function(){$(this).find(".details").slideToggle("fast")}),t}var s,o,u=0,l=30,c=$("#more"),p=t.find(".rows"),q="&nbsp;&nbsp;-&nbsp;&nbsp;",d=e.map(function(e){return{qDef:{qFieldDefs:[e],qSortCriterias:[{qSortByNumeric:-1}]}}});QIX.app.createSessionObject({qInfo:{qId:"",qType:"HyperCube"},qHyperCubeDef:{qDimensions:d,qSuppressMissing:!0,qSuppressZero:!0,qInterColumnSortOrder:[2],qInitialDataFetch:[{qTop:0,qLeft:0,qHeight:l,qWidth:d.length+1}]}}).then(function(e){s=e,n()});var f=pubsub.subscribe("update",n);pubsub.subscribe("kill",function(){pubsub.unsubscribe(f)}),c.click(function(e){a()})}function WordCloud(e,t,n){function a(){s.getLayout().then(function(e){function t(t,n,i){p.selectAll("text").remove(),q=n?Math.min(l/Math.abs(n[1].x-l/2),l/Math.abs(n[0].x-l/2),c/Math.abs(n[1].y-c/2),c/Math.abs(n[0].y-c/2))/2:1;var o=s.selectAll("text").data(t,function(e){return e.text});o.enter().append("text").on("click",function(e){r(e.qElem)}).attr("class","hash").attr("text-anchor","middle").attr("transform",function(e){return"translate("+[e.x,e.y]+")"}).style("font-size",function(e){return e.size+"px"}).style("cursor","pointer").style("opacity",function(t){return e.qHyperCube.qDataPages[0].qMatrix.length>1?a(t.value)/100:1}).style("fill","rgb(39, 48, 81)").text(function(e){return e.text})}if(p.attr("width",l).attr("height",c),p.selectAll("*").remove(),0===e.qHyperCube.qSize.qcy)return void p.append("text").attr("text-anchor","middle").attr("transform",function(e){return"translate("+[l/2,c/2]+")"}).style("font-size","16px").style("fill","rgb(39, 48, 81)").text("No Hashtags Available");o=d3.max(e.qHyperCube.qDataPages[0].qMatrix.map(function(e){return e[1].qNum})),u=d3.min(e.qHyperCube.qDataPages[0].qMatrix.map(function(e){return e[1].qNum}));var n=d3.scale.log().range([16,d]);n.domain([u,o]);{var a=d3.scale.linear().range([60,100]).domain([u,o]),i=e.qHyperCube.qDataPages[0].qMatrix.map(function(e){return{key:e[0].qText,size:e[1].qNum,value:e[1].qNum,qElem:e[0].qElemNumber}}),s=(p.append("g"),p.append("g").attr("transform","translate("+[l>>1,c>>1]+")"));d3.layout.cloud().words(i).timeInterval(10).padding(2).size([l,c]).fontWeight("bold").spiral("rectangular").font("Impact").fontSize(function(t){return 1!=e.qHyperCube.qDataPages[0].qMatrix.length?n(+t.size):d}).rotate(0).text(function(e){return e.key}).on("end",t).start()}})}function i(){l!==n.offsetWidth&&(l=n.offsetWidth,c=n.offsetHeight,a())}function r(e){s.selectHyperCubeValues("/qHyperCubeDef",0,[e],!0).then(function(e){pubsub.publish("update")})}var s,o,u,l=n.offsetWidth,c=n.offsetWidth,p=d3.select(n).append("svg").attr("id","svgwordcloud"),q=1,d=42;QIX.app.createSessionObject({qInfo:{qId:"",qType:"HyperCube"},qHyperCubeDef:{qDimensions:[{qNullSuppression:!0,qDef:{qFieldDefs:[e],qFieldLabels:["Test"],qSortCriterias:[{qSortByNumeric:-1}]}}],qMeasures:[{qLibraryId:"",qSortBy:{qSortByNumeric:-1},qDef:{qLabel:"",qDescription:"",qDef:t}}],qSuppressMissing:!0,qSuppressZero:!0,qInterColumnSortOrder:[1,0],qInitialDataFetch:[{qTop:0,qLeft:0,qHeight:50,qWidth:2}]}}).then(function(e){s=e,a()});var f=pubsub.subscribe("update",a);pubsub.subscribe("kill",function(){pubsub.unsubscribe(f)});pubsub.subscribe("resize",i)}function WorldMap(e,t,n){function a(){QIX.app.createSessionObject({qInfo:{qId:"",qType:"HyperCube"},qHyperCubeDef:{qDimensions:h,qMeasures:[{qLibraryId:"",qSortBy:{qSortByNumeric:-1},qDef:{qLabel:"",qDescription:"",qDef:t}}],qInterColumnSortOrder:[2],qInitialDataFetch:[{qTop:0,qLeft:0,qHeight:g,qWidth:h.length+1}]}}).then(function(e){o=e,i()})}function i(){o.getLayout().then(function(e){y.selectAll("circle").remove();var t,n=e.qHyperCube.qMeasureInfo[0].qMax,a=e.qHyperCube.qMeasureInfo[0].qMin;t=d3.scale.sqrt().domain([a,n]).range(300>f?[0,15]:[0,25]),m={},e.qHyperCube.qDataPages[0].qMatrix.forEach(function(e){m[e[0].qText]={value:e[2].qNum,name:e[1].qText,elem:e[0].qElemNumber}});var i=u.features.filter(function(e){return m.hasOwnProperty(e.id)});y.selectAll("circle").attr("class","bubble").data(i).enter().append("circle").attr("cx",function(e){return d.centroid(e)[0]}).attr("cy",function(e){return d.centroid(e)[1]}).attr("r",function(n){return 1===e.qHyperCube.qDataPages[0].qMatrix.length?10:t(m[n.id].value)}).on("mouseover",v.show).on("mouseout",v.hide).on("click",function(e,t){s(m[e.id].elem)})})}function r(){y.selectAll("path, circle").remove(),f=n.offsetWidth,b=f/1.5,y.attr("width",f).attr("height",b),q=d3.geo.mercator().scale(1).translate([0,0]),d=d3.geo.path().projection(q),l=d.bounds(u),c=.95/Math.max((l[1][0]-l[0][0])/f,(l[1][1]-l[0][1])/b),p=[(f-c*(l[1][0]+l[0][0]))/2,(b-c*(l[1][1]+l[0][1]))/2],q.scale(c).translate(p),y.selectAll("path").data(u.features).enter().append("path").attr("d",d),i()}function s(e){o.selectHyperCubeValues("/qHyperCubeDef",0,[e],!0).then(function(e){pubsub.publish("update")})}var o,u,l,c,p,q,d,f,b,h=e.map(function(e){return{qNullSuppression:!0,qDef:{qFieldDefs:[e.dim],qFieldLabels:[e.label],qSortCriterias:[{qSortByNumeric:-1}]}}}),m={},g=500;f=n.offsetWidth,b=f/1.5,q=d3.geo.mercator().scale(1).translate([0,0]),d=d3.geo.path().projection(q);var y=d3.select(n).append("svg").attr("width",f).attr("height",b),v=d3.tip().attr("class","d3-tip").offset([-10,0]).html(function(e){return"<span>"+m[e.id].name+": "+m[e.id].value+" </span>"});y.call(v),d3.json("/static/data/world.geo.json",function(e,t){return e?console.error(e):(u=t,l=d.bounds(u),c=.95/Math.max((l[1][0]-l[0][0])/f,(l[1][1]-l[0][1])/b),p=[(f-c*(l[1][0]+l[0][0]))/2,(b-c*(l[1][1]+l[0][1]))/2],q.scale(c).translate(p),y.selectAll("path").data(t.features).enter().append("path").attr("d",d),void a())});var x=pubsub.subscribe("update",i);pubsub.subscribe("kill",function(){pubsub.unsubscribe(x)}),pubsub.subscribe("resize",r)}!function(e){e.fn.invisible=function(){return this.each(function(){e(this).css("visibility","hidden")})},e.fn.visible=function(){return this.each(function(){e(this).css("visibility","visible")})}}(jQuery);