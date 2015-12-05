!function(){"use strict";function a(a){var c=new XMLHttpRequest,d="https://api.foursquare.com/v2/venues/search?ll="+a.position.lat()+","+a.position.lng()+"&limit=1&radius=100&oauth_token=MA1GR4J2VETXZPIGSPCMSS1A4WGKLVFFG41IVZMQY54KXIP2&v=20140806";c.onreadystatechange=function(){if(4==c.readyState&&200==c.status){var a=JSON.parse(c.responseText);b(a.response.venues[0].id)}else 4==c.readyState&&200!=c.status&&(document.getElementById("error").innerHTML="Sorry. We're unable to find info about the place!")},c.open("GET",d,!0),c.send()}function b(a){var b=new XMLHttpRequest,c="https://api.foursquare.com/v2/venues/"+a+"/tips?oauth_token=MA1GR4J2VETXZPIGSPCMSS1A4WGKLVFFG41IVZMQY54KXIP2&v=20140806&sort=popular&limit=3";b.onreadystatechange=function(){if(4==b.readyState&&200==b.status){var a=JSON.parse(b.responseText),c=document.createTextNode(a.response.tips.items[0].text),d=document.getElementById("tips");d.appendChild(c)}else 4==b.readyState&&200!=b.status&&(document.getElementById("error").innerHTML="Sorry. We're unable to find any tips!")},b.open("GET",c,!0),b.send()}var c=[{placeName:"San Francisco Zoo",icon:"img/koala.png",latLng:{lat:37.732873,lng:-122.502972},photos:["img/sf-zoo-1.jpg","img/sf-zoo-2.jpg","img/sf-zoo-3.jpg"]},{placeName:"Mission Dolores Park",icon:"img/park.png",latLng:{lat:37.759718,lng:-122.427058},photos:["img/dolores-park-1.jpg","img/dolores-park-2.jpg","img/dolores-park-3.jpg"]},{placeName:"Japanese Tea Garden",icon:"img/garden.png",latLng:{lat:37.769752,lng:-122.469799},photos:["img/japanese-garden-1.jpg","img/japanese-garden-2.jpg","img/japanese-garden-3.jpg"]},{placeName:"Baker Beach",icon:"img/beach.png",latLng:{lat:37.793562,lng:-122.483578},photos:["img/baker-beach-1.jpg","img/baker-beach-2.jpg","img/baker-beach-3.jpg"]},{placeName:"Fort Point",icon:"img/fort.png",latLng:{lat:37.810594,lng:-122.476964},photos:["img/fort-point-1.jpg","img/fort-point-2.jpg","img/fort-point-3.jpg"]},{placeName:"Coit Tower",icon:"img/tower.png",latLng:{lat:37.802396,lng:-122.405789},photos:["img/coit-tower-1.jpg","img/coit-tower-2.jpg","img/coit-tower-3.jpg"]}],d=function(a,b,c,d){return new google.maps.Marker({position:a,map:d,icon:c,title:b})},e=function(a){var b=document.getElementById("info"),c=document.createElement("div");c.id="answer";var d=document.createElement("button");d.id="questionBtn";var e=document.createTextNode("Do you think I should go?");d.appendChild(e),d.onclick=function(){return f(a)},c.appendChild(d),b.appendChild(c)},f=function(a){var b=new XMLHttpRequest,c="http://yesno.wtf/api/";b.onreadystatechange=function(){if(4==b.readyState&&200==b.status){var c=JSON.parse(b.responseText),d=document.createElement("img"),e=document.getElementById("questionBtn");d.setAttribute("src",c.image),e.style.display="none",document.getElementById("answer").appendChild(d);var f=a.getMap(),g=a.getPosition(),h=f.getBounds().getSouthWest(),i=f.getCenter(),j=g.lat()-h.lat(),k=i.lat()+j/2;f.setCenter({lat:k,lng:i.lng()})}else 4==b.readyState&&200!=b.status&&(document.getElementById("error").innerHTML="Something went wrong. Ask me later!")},b.open("GET",c,!0),b.send()},g=function(b){var c=this;this.currentPlaceImages=ko.observableArray([]);var f=new google.maps.LatLng(37.765733,-122.454162),g={zoom:12,center:f,mapTypeId:google.maps.MapTypeId.ROADMAP};this.map=new google.maps.Map(document.getElementById("map"),g),this.infowindow=new google.maps.InfoWindow,this.highlightMarker=function(b){var d='<div id="info"><h1>'+b.title+'</h1><div id="tips"></div><div id="error"></div></div>';c.infowindow.setContent(d),c.infowindow.open(b.get("map"),b),c.map.setZoom(12),c.pounceMarker(b),c.addPhotos(b),a(b),e(b)},this.pounceMarker=function(a){a.setAnimation(google.maps.Animation.BOUNCE),c.stopAnimation(a),c.map.panTo(a.getPosition())},this.stopAnimation=function(a){setTimeout(function(){a.setAnimation(null)},1e3)},this.addPhotos=function(a){var b=a.photos.length,d=a.photos;c.currentPlaceImages.removeAll();for(var e=0;b>e;++e)c.currentPlaceImages.push(d[e])},this.markers=ko.observableArray(b.map(function(a){var b=a.photos,a=new d(a.latLng,a.placeName,a.icon,c.map);return a.photos=b,google.maps.event.addListener(a,"click",function(){c.highlightMarker(a)}),a})),this.visibleMarkers=this.markers,this.query=ko.observable(""),this.runQuery=ko.computed(function(){this.visibleMarkers=ko.computed(function(){var a=this.query();return this.markers().filter(function(b){return b.title.toLowerCase().indexOf(a.toLowerCase())>=0?(b.setVisible(!0),b):void b.setVisible(!1)})},this)},this)},h=new g(c||[]);ko.applyBindings(h)}();