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
  var markers = {};
  $.ajax('data/spots.csv').done(
    function(data) {
      var parsed_data = Papa.parse(data, {header: true});
      for(var i in parsed_data.data) {
	var spot = parsed_data.data[i];
	if(spot.category == "") { continue; }
	var latLng = new google.maps.LatLng(parseFloat(spot.lat), parseFloat(spot.lng));
	var marker = new google.maps.Marker({
	  position: latLng,
	  map: map,
	  title: spot.name,
	  visible: spot.category == 1
	});
	if ( markers[spot.category] ) {
	  markers[spot.category].push(marker);
	} else {
	  markers[spot.category] = [marker];
	}
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
      $categorySelector = $(".categorySelector select");
      var parsed_data = Papa.parse(data, {header: true});
      for(var i in parsed_data.data) {
	var category = parsed_data.data[i];
	if(category.id == "") { continue; }
	$option = $("<option />").val(category.id).text(category.name);
	$categorySelector.append($option);
      }
      $categorySelector.change(function() {
	$selectedCategory = $(this).val();
	for(var i in markers) {
	  var visibility = false;
	  if(i == $selectedCategory) {
	    visibility = true;
	  }
	  $.each(markers[i], function() {
	    this.setVisible(visibility);
	  });
	}
      });
    }
  );
}
google.maps.event.addDomListener(window, 'load', initialize);
