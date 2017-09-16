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
				socket.emit('allQuestionsCorrect', 'secret code');
			}
		});

	});
}