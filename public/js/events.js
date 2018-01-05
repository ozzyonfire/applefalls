$(document).ready(() => {

	$('[data-toggle="tooltip"]').tooltip();

	$('#submitTourButton').click(() => {
		// validate form
		var valid = true;
		var tourRequest = {
			type: $('#tourType').val(),
			name: $('#nameInput').val(),
			email: $('#emailInput').val(),
			phone: $('#phoneInput').val(),
			attendees: $('#peopleInput').val(),
			date: $('#datePicker').val(),
			time: $('#timePicker').val()
		};

		if (validateName(tourRequest.name) && 
			validateEmail(tourRequest.email) && 
			validatePhone(tourRequest.phone)) {
			socket.emit('tourRequest', tourRequest);

			// display message
			$('#tourForm').empty();
			$('#tourForm').append($('<p class="text-center" style="padding-top:40px;">Thanks for your request! We\'ll get back to you ASAP to coordinate the tour.</p>'));
		}
	});

	$('#nameInput').on('change', () => {
		validateName($('#nameInput').val());
	});

	$('#emailInput').on('change', () => {
		validateEmail($('#emailInput').val());
	});

	$('#phoneInput').on('change', () => {
		validatePhone($('#phoneInput').val());
	});
});

function validatePhone(phoneNumber) {
	if (phoneNumber.phone == '') {
		valid = false;
		$('#phoneInput').focus();
		$('#phoneHint').text('A phone number is required.');
		return false;
	} else {
		var phoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
		if (phoneRegex.test(phoneNumber)) {
			var formattedPhoneNumber = phoneNumber.replace(phoneRegex, "($1) $2-$3");
			$('#phoneInput').val(formattedPhoneNumber);
			$('#phoneHint').text('');
			return true;
		} else {
			$('#phoneHint').text('A valid phone number is required.');
			$('#phoneInput').focus();
			return false;
		}
	}
}

function validateName(name) {
	if (name == '') {
		$('#nameInput').focus();
		$('#nameHint').text('Please enter your name.');
		return false;
	}
	$('#nameHint').text('');
	return true;
}

function validateEmail(email) {
	var emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	if (emailRegex.test(email)) {
		$('#emailHint').text('');
		return true;
	}
	$('#emailInput').focus();
	$('#emailHint').text('Please enter a valid email.');
	return false;
}