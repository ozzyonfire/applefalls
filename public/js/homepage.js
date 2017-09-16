var socket = io();

function getRandom(min, max) {
  return Math.random() * (max - min) + min;
}

function getOffScreen(left) {
    var pos = {};
    if (left) {
        pos.pageX = getRandom(-1500, -500);
    } else {
        pos.pageX = getRandom($(window).width() + 100, $(window).width() + 1000);
    }
    pos.pageY = getRandom(-100, 1200);
    return pos;
}

var oldPosition = {};
var gotNextRose = false;
var timer;
var lengthOfTime = 3000;

$(window).load(function() {
    roses();

    // set the position of the bee
    var startingPosition;
    if (Math.random() > 0.5) {
        startingPosition = getOffScreen(true);
    } else {
        startingPosition = getOffScreen(false);
    }

    oldPosition.x = startingPosition.pageX;
    oldPosition.y = startingPosition.pageY;

    $('#bumblebee').css('left', startingPosition.pageX + 'px');
    $('#bumblebee').css('top', startingPosition.pageY + 'px');

    // only do this once
    $('#roseButton3').click(function(e) {
        lengthOfTime = 2500;
        playDing();
        moveBee(e, false, function() {
            $('#roseButton2').removeClass('hidden');
            $('#roseButton3').addClass('hidden');
        });
    });
    $('#roseButton2').click(function(e) {
        clearTimeout(timer);
        lengthOfTime -= 1000;
        playDing();
        moveBee(e, false, function() {
            $('#roseButton2').addClass('hidden');
            $('#roseButton1').removeClass('hidden');
        })
    });
    $('#roseButton1').click(function(e) {
        clearTimeout(timer);
        lengthOfTime -= 1000;
        playDing();
        moveBee(e, false, function() {
            $('#roseButton1').addClass('hidden');
            $('#roseButton4').removeClass('hidden');
        })
    });
    $('#roseButton4').click(function(e) {
        clearTimeout(timer);
        playDing();
        moveBee(e, true, function() {
            console.log('you made it!');
        });
    });
});

$(window).resize(function() {
    roses();
    resizeBoomerang();
});

$(document).ready(function() {
    resizeBoomerang();

    sendValidateEvent('ciderQ');
    sendValidateEvent('instaQ');
    sendValidateEvent('houseQ');
    sendValidateEvent('tankQ');
    sendValidateEvent('riddleQ');
});

function sendValidateEvent(inputName) {
    $('#'+inputName).on('input', function(e) {
        socket.emit('validate', inputName, $(this).val());
    });
}

function playDing() {
    var ding = $('#ding')[0];
    ding.pause();
    ding.currentTime = 0;
    ding.play();
}

function playDong() {
    var ding = $('#wrong')[0];
    ding.pause();
    ding.currentTime = 0;
    ding.play();
}

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

function startTimer() {
    timer = setTimeout(function() {
        // disable all buttons
        disableAllButtons();
        playDong();
        moveBee(getOffScreen(Math.random() > 0.5), true, function() {
            // enable the first rose (reset)
            $('#roseButton3').removeClass('hidden');
        });
    }, lengthOfTime);
}

function disableAllButtons() {
    $('#roseButton1').addClass('hidden');
    $('#roseButton2').addClass('hidden');
    $('#roseButton3').addClass('hidden');
    $('#roseButton4').addClass('hidden');
}

function moveBee(e, noTimer, callback) {
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
        callback();
        if (noTimer != true)
            startTimer();
    });
}

function lerp(a, b, f) {
    return (a * (1.0 - f)) + (b * f);
}

// socket events
socket.on('q1_correct', function() {
    correct('ciderQIcon');
});

socket.on('q1_incorrect', function() {
    incorrect('ciderQIcon');
});

socket.on('q2_correct', function() {
    correct('instaQIcon');
});

socket.on('q2_incorrect', function() {
    incorrect('instaQIcon');
});

socket.on('q3_correct', function() {
    correct('houseQIcon');
});

socket.on('q3_incorrect', function() {
    incorrect('houseQIcon');
});

socket.on('q4_correct', function() {
    correct('tankQIcon');
});

socket.on('q4_incorrect', function() {
    incorrect('tankQIcon');
});

socket.on('q5_correct', function() {
    correct('riddleQIcon');
});

socket.on('q5_incorrect', function() {
    incorrect('riddleQIcon');
});

socket.on('allQuestionsCorrect', function(code) {
    console.log(code);
    $('#secretCode').val(code);
    $('#nextButton').removeClass('disabled');
});

function correct(iconName) {
    $('#'+iconName).removeClass('fa-times');
    $('#'+iconName).addClass('fa-check');
}

function incorrect(iconName) {
    $('#'+iconName).addClass('fa-times');
    $('#'+iconName).removeClass('fa-check');
}