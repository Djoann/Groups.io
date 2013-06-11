var Markers;

Meteor.subscribe('markers');

Markers = new Meteor.Collection('markers');

/*
//windows size
window.resize = function(t) {
  var c, h, m, top, w;
  w = window.innerWidth;
  h = window.innerHeight;
  top = t.find('#map').offsetTop;
  c = w - 40;
  m = (h - top) - 65;
  t.find('#blabla').style.width = "" + c + "px";
  return t.find('#map').style.height = "" + m + "px";
}; */

Template.map.rendered = function() {
  var query,
    _this = this;
  /*window.resize(this);
  $(window).resize(function() {
    return window.resize(_this);
  });*/
  //ICONE STYLE
  L.Icon.Default.imagePath = 'packages/leaflet/images';
  window.map = L.map('map', {
    doubleClickZoom: false
  }).setView([48.9, 2.35], 10);
  L.tileLayer("http://{s}.tile.cloudmade.com/ffdd86e27a8a46129afb5e678456afaf/997/256/{z}/{x}/{y}.png", {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>'
  }).addTo(window.map);
  window.map.on('dblclick', function(e) {
    return Markers.insert({
      latlng: e.latlng
    });
  });
  query = Markers.find({});
  return query.observe({
    added: function(mark) {
      var marker;
      
      
      // MAPPING POINTS LIST
      $("#masterbublebox h3").each( function () {
              //$(this).children().addClass("hello")
              var e = $(this);
              var lat = e.attr("data-lat");
              var lng = e.attr("data-lng");
              if (lat && lng) {
                  var marker = L.marker([lat, lng]).bindPopup(e.html()).addTo(map);
                  marker.on("click", function () { marker.openPopup()})
              }
      });
      
      
      
      //Onclick Map Lat lng 
      var popup = L.popup();
      
      function onMapClick(e) {
          popup
              .setLatLng(e.latlng)
              .setContent("You clicked the map at " + e.latlng.toString())
              .openOn(map);
      }
      
      map.on('click', onMapClick);
      
      return marker = L.marker(mark.latlng).addTo(window.map).on('click', function(e) {
        return Markers.remove({
          latlng: this._latlng
        });
      });
    },
    removed: function(mark) {
      var key, layers, val, _results;
      layers = window.map._layers;
      _results = [];
      for (key in layers) {
        val = layers[key];
        if (!val._latlng) {

        } else {
          if (val._latlng.lat === mark.latlng.lat && val._latlng.lng === mark.latlng.lng) {
            _results.push(window.map.removeLayer(val));
          } else {
            _results.push(void 0);
          }
        }
      }
      return _results;
    }
  });
};
