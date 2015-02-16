function initialize() {
  var mapOptions = {
    center: new google.maps.LatLng(35.7780787, 139.7972246),
    zoom: 14,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };
  $("#map").height($(".row").height() - $(".spot-description").height());
  var map = new google.maps.Map(
    document.getElementById("map"),
    mapOptions
  );
  var spots, categories;
  $.ajax('data/spots.csv').done(
    function(data) {
      spots = Papa.parse(data, {header: true});
      for(var i in spots.data) {
	var spot = spots.data[i];
	var latLng = new google.maps.LatLng(parseFloat(spot.lat), parseFloat(spot.lng));
	var marker = new google.maps.Marker({
	  position: latLng,
	  map: map,
	  title: spot.name
	});
	google.maps.event.addListener(marker, 'click', (function(_spot) {
	  return function() {
	    var _marker = this;
	    map.setCenter(_marker.getPosition());
	    $a = $("<a />").attr("href", _spot.link).attr("target", "_blank").text(_spot.name);
	    $(".spot-description").empty().append($a);
	    $(".spot-description").show();
	    $("#map").height($(".row").height() - $(".spot-description").height());
	  };
	})(spot));
      }
    }
  );
  $.ajax('data/category.csv').done(
    function(data) {
      /* TODO */
    }
  );
}
google.maps.event.addDomListener(window, 'load', initialize);
