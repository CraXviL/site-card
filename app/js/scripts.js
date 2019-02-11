$(document).ready(() => {

	const HEIGHT1 = parseInt($('#main').css('height'), 10) + parseInt($('header').css('height'), 10);
	const HEIGHT2 = parseInt($('#about').css('height'), 10) + parseInt($('#skills').css('height'), 10);
	const HEIGHT3 = parseInt($('#portfolio').css('height'), 10);

	// console.log(HEIGHT1, HEIGHT2, HEIGHT3);

	$('#menu-about').click(() => {
		$('html').animate({ scrollTop: HEIGHT1 });
		window.location = '#about';
	});
	$('#menu-portfolio').click(() => {
		$('html').animate({ scrollTop: HEIGHT1 + HEIGHT2 + 500});
		window.location = '#portfolio';
	});
	$('#menu-contacts').click(() => {
		$('html').animate({ scrollTop: HEIGHT1 + HEIGHT2 + HEIGHT3 + 500});
		window.location = '#order';
	});

	$('input[name="name"]').on('input', (e) => {
		validate(e, /^[ а-яё]+$/gi);
	});
	$('input[name="phone"]').on('input', (e) => {
		validate(e, /^((8|\+7)[- ]?)?(\(?\d{3}\)?[- ]?)?[\d- ]{7,10}$/);
	});
	$('input[name="email"]').on('input', (e) => {
		validate(e, /^([a-z0-9_-]+\.)*[a-z0-9_-]+@[a-z0-9_-]+(\.[a-z0-9_-]+)*\.[a-z]{2,6}$/);
	});

	function validate(e, regExp) {
		if (!regExp.test(e.target.value.trim())) {
			$(e.target).addClass('error');
		} else {
			$(e.target).removeClass('error');
		}
	}

	$('form').submit((e) => {
		e.preventDefault();
		$.ajax({
			url: 'sendmail.php',
			type: 'POST',
			data: $('form').serialize(),
			success: function () {
				console.log('Запрос отправлен');
			},
			error: function () {
				console.log('Возникла ошибка при отправке');
			}
		});
		$('form').fadeOut();
		window.setTimeout(() => {
			$('form').html('<h2>Отправлено!</h2><p>Я с Вами обязательно свяжусь</p>');
			$('form').fadeIn();
		}, 500);
	});

});
