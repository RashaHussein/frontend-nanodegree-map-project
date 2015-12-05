function googleSuccess() {
  'use strict';
  console.log('m here');
  // List of markers to display on map
  var markers = [
    {
      placeName: 'San Francisco Zoo',
      icon: 'img/koala.png',
      latLng: {
        lat: 37.732873,
        lng: -122.502972
      },
      photos: [
        'img/sf-zoo-1.jpg',
        'img/sf-zoo-2.jpg',
        'img/sf-zoo-3.jpg'
      ]
    },
    {
      placeName: 'Mission Dolores Park',
      icon: 'img/park.png',
      latLng: {
        lat: 37.759718,
        lng: -122.427058
      },
      photos: [
        'img/dolores-park-1.jpg',
        'img/dolores-park-2.jpg',
        'img/dolores-park-3.jpg'
      ]
    },
    {
      placeName: 'Japanese Tea Garden',
      icon: 'img/garden.png',
      latLng: {
        lat: 37.769752,
        lng: -122.469799
      },
      photos: [
        'img/japanese-garden-1.jpg',
        'img/japanese-garden-2.jpg',
        'img/japanese-garden-3.jpg'
      ]
    },
    {
      placeName: 'Baker Beach',
      icon: 'img/beach.png',
      latLng: {
        lat: 37.793562,
        lng: -122.483578
      },
      photos: [
        'img/baker-beach-1.jpg',
        'img/baker-beach-2.jpg',
        'img/baker-beach-3.jpg'
      ]
    },
    {
      placeName: 'Fort Point',
      icon: 'img/fort.png',
      latLng: {
        lat: 37.810594,
        lng: -122.476964
      },
      photos: [
        'img/fort-point-1.jpg',
        'img/fort-point-2.jpg',
        'img/fort-point-3.jpg'
      ]
    },
    {
      placeName: 'Coit Tower',
      icon: 'img/tower.png',
      latLng: {
        lat: 37.802396,
        lng: -122.405789
      },
      photos: [
        'img/coit-tower-1.jpg',
        'img/coit-tower-2.jpg',
        'img/coit-tower-3.jpg'
      ]
    }
  ];

  /**
   * Helper function to check if element has certain class
   */
  function hasClass(element, className) {
    return (' ' + element.className + ' ').indexOf(' ' + className + ' ') > -1;
  }

  /**
   * Represents a single map marker
   */
  var Marker = function (latLng, placeName, icon, map) {
    return new google.maps.Marker({
      position: latLng,
      map: map,
      icon: icon,
      title: placeName
    });
  };

  /**
   * Append a button to the infowindow for the random yes or no answer
   */
  var appendYesOrNo = function(marker) {
    // Get the info window currently displayed.
    var infowindow = document.getElementById('info');
    // Attach a button to call YesOrNo API
    var div = document.createElement('div');
    div.id = 'answer';
    var btn = document.createElement('button');
    btn.id = 'questionBtn';
    var t = document.createTextNode('Do you think I should go?');
    btn.appendChild(t);
    btn.onclick = (function(){return yesOrNo(marker)});
    div.appendChild(btn);
    infowindow.appendChild(div);
  };

  /**
   * Use yesno api to retrieve a random yes or no answer with a gif
   */
  var yesOrNo = function(marker) {
    var xhttp = new XMLHttpRequest();
    var yesOrNoApiUrl = 'http://yesno.wtf/api/'
    xhttp.onreadystatechange = function() {
      if (xhttp.readyState == 4 && xhttp.status == 200) {
        var responseJson = JSON.parse(xhttp.responseText);
        var oImg=document.createElement('img');
        var btn = document.getElementById('questionBtn');
        oImg.setAttribute('src', responseJson.image);
        btn.style.display = 'none';
        document.getElementById('answer').appendChild(oImg);

        // Change center of map for marker to be at the bottom,
        // to display full info window
        var map = marker.getMap();
        var markerPos = marker.getPosition();
        var getSouthWest = map.getBounds().getSouthWest();
        var mapCenter = map.getCenter();

        var markerPosSWDiff = markerPos.lat() - getSouthWest.lat();

        var newLat = mapCenter.lat() + (markerPosSWDiff/2);

        map.setCenter({lat: newLat, lng: mapCenter.lng()});
      } else if (xhttp.readyState == 4 && xhttp.status != 200) {
        document.getElementById('error').innerHTML = 'Something went wrong. Ask me later!';
      }
    };
    xhttp.open('GET', yesOrNoApiUrl, true);
    xhttp.send();
  };

  /**
   * Use Foursquare api to get the place id then use it to get tips
   */
  function getFoursquareTips(marker) {
      var xhttp = new XMLHttpRequest();
      var getPlaceUrl = 'https://api.foursquare.com/v2/venues/search?'+
        'll=' + marker.position.lat() + ',' + marker.position.lng() +
        '&limit=1&radius=100&'+
        'oauth_token=MA1GR4J2VETXZPIGSPCMSS1A4WGKLVFFG41IVZMQY54KXIP2&'+
        'v=20140806';
      xhttp.onreadystatechange = function() {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
          var responseJson = JSON.parse(xhttp.responseText);
          getTips(responseJson.response.venues[0].id);
        } else if (xhttp.readyState == 4 && xhttp.status != 200) {
          document.getElementById('error').innerHTML = 'Sorry. We\'re unable to find info about the place!';
        }
      };
      xhttp.open('GET', getPlaceUrl, true);
      xhttp.send();
    };

    /**
     * Use Foursquare api to get tips for the place giving the place id
     */
    function getTips(placeId) {
      var xhttp = new XMLHttpRequest();
      var getTipsUrl = 'https://api.foursquare.com/v2/venues/'+
        placeId + '/tips?'+
        'oauth_token=MA1GR4J2VETXZPIGSPCMSS1A4WGKLVFFG41IVZMQY54KXIP2&v=20140806'+
        '&sort=popular&limit=3';
      xhttp.onreadystatechange = function() {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
          var responseJson = JSON.parse(xhttp.responseText);
          var text = document.createTextNode(responseJson.response.tips.items[0].text);

          var tipsDiv = document.getElementById('tips');
          tipsDiv.appendChild(text);
        } else if (xhttp.readyState == 4 && xhttp.status != 200) {
          document.getElementById('error').innerHTML = 'Sorry. We\'re unable to find any tips!';
        }
      };
      xhttp.open('GET', getTipsUrl, true);
      xhttp.send();
    };

  /**
   * The ViewModel for our neighborhood App
   */
  var ViewModel = function (markers) {
    // Refer to the context of ViewModel
    var vmCtx = this;
    this.currentPlaceImages = ko.observableArray([]);

    // Define center of map and map options
    var myLatlng = new google.maps.LatLng(37.765733, -122.454162);
    var mapOptions = {
      zoom: 12,
      center: myLatlng,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    // Load map in map div
    this.map = new google.maps.Map(document.getElementById('map'),
      mapOptions);

    // Create one infowindow to be used by all marker, instead of creating one
    // for every marker, to avoid visual clutter and have only one window open
    // at any given time
    this.infowindow = new google.maps.InfoWindow();

    /**
     * Executes when a marker or its corresponding name in the list is clicked
     */
    this.highlightMarker = function(marker) {
      var self = vmCtx;

      // Check if name list is shown, hide it.
      // This hides the fullscreen list of places names when it's on mobile
      var nameList = document.getElementById('list-menu');
      if(hasClass(nameList, 'activated')) {
        nameList.className = '';
      }
      var content = '<div id="info"><h1>' + marker.title + '</h1>'+
        '<div id="tips"></div><div id="error"></div>'+'</div>';
      vmCtx.infowindow.setContent(content);
      vmCtx.infowindow.open(marker.get('map'), marker);
      vmCtx.map.setZoom(12);
      vmCtx.pounceMarker(marker);
      vmCtx.addPhotos(marker);
      getFoursquareTips(marker);
      appendYesOrNo(marker);
    };

    /**
     * Triggers marker pounce animation
     */
    this.pounceMarker = function(marker) {
      // Trigger animation
      marker.setAnimation(google.maps.Animation.BOUNCE);
      // Stop animation
      vmCtx.stopAnimation(marker);
      // Set center of map to the current marker position
      vmCtx.map.panTo(marker.getPosition());
    };

    /**
     * Stop marker pounce animation
     */
    this.stopAnimation = function(marker) {
      setTimeout(function () {
          marker.setAnimation(null);
      }, 1000);
    };

    /**
     * Add current marker's place photos to currentPlaceImages observable array
     */
    this.addPhotos = function(marker) {
      var len = marker.photos.length,
        photos = marker.photos;
      // Clear pictures of past marker
      vmCtx.currentPlaceImages.removeAll();

      // Add the new marker photos
      for(var i = 0; i < len; ++i) {
        vmCtx.currentPlaceImages.push(photos[i]);
      }
    };

    /**
     * Map array of passed markers to an observableArray of Marker objects
     */
    this.markers = ko.observableArray(markers.map(function (marker) {
      var photos = marker.photos;
      var marker = new Marker(marker.latLng, marker.placeName, marker.icon, vmCtx.map);
      marker.photos = photos;
      google.maps.event.addListener(marker, 'click', function() {
        vmCtx.highlightMarker(marker);
      });
      return marker;
    }));

    // Keep track of visible markers
    this.visibleMarkers = this.markers;

    // Show List of names
    this.activateList = function() {
      var element = document.getElementById('list-menu');
      console.log(element.style);
      if(!element.style.display) {
        element.className = 'activated';
      }
    }

    // Value of search query
    this.query = ko.observable('');

    /**
     * Search markers for a name that matches the search query and
     * add the matched markers to the visibleMarkers observable array
     */
    this.runQuery = ko.computed(function() {
      this.visibleMarkers = ko.computed(function() {
        var query = this.query()
        // Filter array elements based on place name, hide the markers that are not a match
        // and save results in visibleMarkers observable array
        return this.markers().filter(function (marker) {
          if(marker.title.toLowerCase().indexOf(query.toLowerCase()) >= 0) {
            marker.setVisible(true);
            return marker;
          } else {
            marker.setVisible(false);
          }
        });
      }, this);
    }, this);
  };

  // Bind a new instance of our view model to the page
  var viewModel = new ViewModel(markers || []);
  ko.applyBindings(viewModel);
  console.log(viewModel);
}

function googleError(){
  var app = document.getElementById('app');
  app.innerHTML = '<div class="error">'+ '<p>Unfortunately we\'re unable to load the map. '+
    'Here\'s some cute cats instead! </p>' +
    '<img src="img/cutecat.jpg"></div>';
}
