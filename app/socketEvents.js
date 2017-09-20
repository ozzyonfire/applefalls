var Code = require('./model/code');

var alphabet = 'abcdefghijklmnopqrstuvwxyz';

module.exports = function(io) {
	io.on('connection', function(socket) {
		var q1, q2, q3, q4, q5;
		socket.on('validate', function(name, value) {
			value = value.toLowerCase();

			switch(name) {
				case 'ciderQ':
					q1 = value == 'premiere';
					if (q1)
						socket.emit('q1_correct');
					else
						socket.emit('q1_incorrect');
					break;
				case 'instaQ':
					q2 = value == 'mac';
					if (q2)
						socket.emit('q2_correct');
					else
						socket.emit('q2_incorrect');
					break;
				case 'houseQ':
					q3 = value == 'amelia' || value == 'amelia\'s';
					if (q3)
						socket.emit('q3_correct');
					else
						socket.emit('q3_incorrect');
					break;
				case 'tankQ':
					q4 = value == 'tina';
					if (q4) 
						socket.emit('q4_correct');
					else
						socket.emit('q4_incorrect');
					break;
				case 'riddleQ':
					value = value.replace(/,| /gi, '');
					q5 = value == 'johncolinmattmaddyamelia';
					if (q5)
						socket.emit('q5_correct');
					else
						socket.emit('q5_incorrect');
					break;
				default:
					console.log('defaulted');
			}

			if (q1 && q2 && q3 && q4 && q5) {
				generateUniqueCode(function(code) {
					var message = 'I am hard AF';
					socket.emit('allQuestionsCorrect', message, code.code);
				});
			}
		});

	});
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive 
}

function generateUniqueCode(callback) {
	var code = generateCode();
	console.log(code);

	Code.findOne({code: code}, function(err, theCode) {
		if (err) {
			console.log('error');
			console.log(err);
		} else {
			console.log('no error');
			if (theCode) {
				generateUniqueCode(callback); // this code already exists
			} else {
				var newCode = new Code();
				newCode.code = code;
				newCode.used = false;
				newCode.save(function(err, savedCode) {
					if (err) {
						console.log(err);
					} else {
						callback(savedCode);
					}
				});
			}
		}
	});
}

function generateCode() {
	var code = alphabet.charAt(getRandomInt(0, 25));
	code += alphabet.charAt(getRandomInt(0, 25));
	code += alphabet.charAt(getRandomInt(0, 25));
	code += alphabet.charAt(getRandomInt(0, 25));
	code = code.toUpperCase();
	return code;
}