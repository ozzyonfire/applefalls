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
    resizeBoomerang();
});

$(document).ready(function() {
    resizeBoomerang();
});

function resizeBoomerang() {
    var width = $('#vidContainer').width();
    var height = width * 0.8;

    $('#boomerang').css('height', height + 'px');
    $('#boomerang').css('width', width + 'px');
}

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
    var SineWave = function(path, arc) {
        this.css = function(p) {
            var s = Math.sin(p*20)
            var x = lerp(path.start.x, path.end.x, (1.0-p));
            var y = s * arc + lerp(path.start.y, path.end.y, (1.0-p));
            return {top: y + "px", left: x + "px"}
        } 
    };

    if ((oldPosition.x - e.pageX) > 0) {
        $('#bumblebee').addClass('flip-y');
    } else {
        $('#bumblebee').removeClass('flip-y');
    }

    var sizeOfBee = $(window).width() * 0.05;

    var newPosition = {
        x: e.pageX-(sizeOfBee/2),
        y: e.pageY-(sizeOfBee/2)
    };

    var distance = Math.sqrt(Math.pow(newPosition.x-oldPosition.x, 2) + Math.pow(newPosition.y-oldPosition.y, 2));
    console.log(distance);
    var duration = distance * 2;
    var arc = distance / 20;


    var path = {
        start: oldPosition, 
        end: newPosition
    };

    $('#bumblebee').animate({
        path: new SineWave(path, arc)
    }, duration, function() {
        oldPosition = path.end;
    });
}

function lerp(a, b, f) {
    return (a * (1.0 - f)) + (b * f);
}