// Google Maps Scripts
var map = null;
// When the window has finished loading create our google map below
google.maps.event.addDomListener(window, 'load', init);
google.maps.event.addDomListener(window, 'resize', function() {
    map.setCenter(new google.maps.LatLng(44.109753, -77.470981));
});

function init() {
    // Basic options for a simple Google Map
    // For more options see: https://developers.google.com/maps/documentation/javascript/reference#MapOptions
    var mapOptions = {
        // How zoomed in you want the map to start at (always required)
        zoom: 15,

        // The latitude and longitude to center the map (always required)
        center: new google.maps.LatLng(44.109753, -77.470981), // Campbell's Orchards

        // Disables the default Google Maps UI components
        disableDefaultUI: false,
        scrollwheel: false,
        draggable: true,

        // How you would like to style the map. 
        // This is where you would paste any style found on Snazzy Maps.
        
        styles: [{"featureType":"administrative.province","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"landscape","elementType":"all","stylers":[{"saturation":-100},{"lightness":65},{"visibility":"on"}]},{"featureType":"landscape","elementType":"geometry.fill","stylers":[{"hue":"#ff0000"}]},{"featureType":"poi","elementType":"all","stylers":[{"saturation":-100},{"lightness":51},{"visibility":"simplified"},{"hue":"#ff0000"}]},{"featureType":"road","elementType":"labels.text.fill","stylers":[{"color":"#000000"}]},{"featureType":"road","elementType":"labels.text.stroke","stylers":[{"color":"#ffffff"}]},{"featureType":"road.highway","elementType":"all","stylers":[{"saturation":-100},{"visibility":"simplified"}]},{"featureType":"road.arterial","elementType":"all","stylers":[{"saturation":-100},{"lightness":30},{"visibility":"on"}]},{"featureType":"road.local","elementType":"all","stylers":[{"saturation":-100},{"lightness":40},{"visibility":"on"}]},{"featureType":"road.local","elementType":"geometry.fill","stylers":[{"hue":"#ff0000"}]},{"featureType":"transit","elementType":"all","stylers":[{"saturation":-100},{"visibility":"simplified"}]},{"featureType":"water","elementType":"geometry","stylers":[{"hue":"#ffff00"},{"lightness":-25},{"saturation":-97}]},{"featureType":"water","elementType":"geometry.fill","stylers":[{"color":"#75cfd7"}]},{"featureType":"water","elementType":"labels","stylers":[{"visibility":"on"},{"lightness":-25},{"saturation":-100}]},{"featureType":"water","elementType":"labels.text.stroke","stylers":[{"color":"#ffffff"}]}]
    };

    // Get the HTML DOM element that will contain your map 
    // We are using a div with id="map" seen below in the <body>
    var mapElement = document.getElementById('map-canvas');

    // Create the Google Map using out element and options defined above
    map = new google.maps.Map(mapElement, mapOptions);

    // Custom Map Marker Icon - Customize the map-marker.png file to customize your icon
    var image = 'img/map-marker.png';
    
    var myLatLng = new google.maps.LatLng(44.109753, -77.470981);
    // var beachMarker = new google.maps.Marker({
    //     position: myLatLng,
    //     map: map,
    //     icon: image
    // }); 


    var marker = new google.maps.Marker({
        map: map,
        icon: {
            path: fontawesome.markers.MAP_MARKER,
            scale: 1.5,
            strokeWeight: 1,
            strokeColor: 'black',
            strokeOpacity: 1,
            fillColor: '#9B2335',
            fillOpacity: 0.9,
        },
        clickable: false,
        position: myLatLng
    });
}

$(window).load(function() {
    roses();

    // only do this once
    $('#roseButton1').click(moveBee);
    $('#roseButton2').click(moveBee);
    $('#roseButton3').click(moveBee);
    $('#roseButton4').click(moveBee);
});

$(window).resize(function() {
    roses();
});

function roses() {
    var rBranchWidth = $('#right-branch').width();
    var rBranchHeight = $('#right-branch').height();
    var lBranchWidth = $('#left-branch').width();
    var lBranchHeight = $('#left-branch').height();

    $('#roseButton1').css('bottom', (rBranchHeight * 0.385) + 'px');
    $('#roseButton1').css('right', (rBranchWidth * 0.69) + 'px');

    $('#roseButton2').css('top', (lBranchHeight * 0.23) + 'px');
    $('#roseButton2').css('left', (lBranchWidth * 0.4) + 'px');

    $('#roseButton3').css('bottom', (rBranchHeight * 0.13) + 'px');
    $('#roseButton3').css('right', (rBranchWidth * 0.56) + 'px');

    $('#roseButton4').css('top', (lBranchHeight * 0.17) + 'px');
    $('#roseButton4').css('left', (lBranchWidth * 0.88) + 'px');
}

var oldPosition = {x: -500, y: -10}; // initial position

function moveBee(e) {
    console.log('function called');
    var SineWave = function(path, arc) {
        this.css = function(p) {
            var s = Math.sin(p*20)
            var x = lerp(path.start.x, path.end.x, (1.0-p));
            var y = s * arc + lerp(path.start.y, path.end.y, (1.0-p));
            console.log(p);
            return {top: y + "px", left: x + "px"}
        } 
    };

    if ((oldPosition.x - e.pageX) > 0) {
        $('#bumblebee').addClass('flip-y');
    } else {
        $('#bumblebee').removeClass('flip-y');
    }

    var distance = Math.sqrt(Math.pow(e.pageX-oldPosition.x, 2), Math.pow(e.pageY-oldPosition.y, 2));
    var duration = distance * 3;
    var arc = distance / 20;

    var path = {
        start: oldPosition, 
        end: {
            x: e.pageX-40,
            y: e.pageY-40
        }
    };

    $('#bumblebee').animate({
        path: new SineWave(path, arc)
    }, duration, function() {
        oldPosition.x = e.pageX;
        oldPosition.y = e.pageY;
    });
}

function lerp(a, b, f) {
    return (a * (1.0 - f)) + (b * f);
}