$(document).ready(() => {
	'use strict';

	$('.navbar-nav a').on('click', (e) => {
		e.preventDefault();
		let target = e.target.getAttribute('href');
		let crtOffset = window.pageYOffset;
		let trgOffset = $(target).offset().top;
		let t = Math.abs(crtOffset - trgOffset)/5;
		$('html, body').animate({ scrollTop: trgOffset-(trgOffset/20) }, t, 'linear');
	});

	$('#block-portfolio ul a').on('click', (e) => {
		e.preventDefault();
		$('#portfolio-modal').show().animate({right: '10%'});
		switch (e.target.id) {
			case 'geometriadizaina':
				$('#portfolio-modal h2').text('Лэндинг для дизайнеров интерьера "ГЕОМЕТРИЯ ДИЗАЙНА"');
				$('#design').attr('href', 'https://yadi.sk/d/DLXXxglkN_Bjjw');
				$('#code').attr('href', 'https://github.com/CraXviL/geometriadizaina.ru');
				$('#webPage').attr('href', 'http://geometriadizaina.ru');
				break;
			case 'prazdnikmne':
				$('#portfolio-modal h2').text('Многостраничный сайт "КОРПОРАЦИЯ ПРАЗДНИКОВ АНАСТАСИИ БАЖЕНОВОЙ"');
				$('#design').attr('href', 'https://yadi.sk/d/oo_e28SAj-_fTg');
				$('#code').attr('href', 'https://github.com/CraXviL/prazdnikmne.ru');
				$('#webPage').attr('href', 'https://prazdnikmne.ru');
				break;
			case 'plita':
				$('#portfolio-modal h2').text('Лэндинг ресторана "PLITA"');
				$('#design').attr('href', 'https://yadi.sk/d/jA22yCzpNXJ1Tg');
				$('#code').attr('href', 'https://github.com/CraXviL/plita');
				$('#webPage').attr('href', 'https://plitarest.ru');
				break;
		}
	});

	/* form sending */

	const inputsList = [
		{ 
			name: 'name',
			pattern: /^[ а-яё]{2,}$/gi,
			valid: false
		},{ 
			name: 'tel',
			pattern: /^((8|\+7)[- ]?)?(\(?\d{3}\)?[- ]?)?[\d- ]{7,10}$/,
			valid: false
		},{ 
			name: 'email',
			pattern: /^([a-z0-9_-]+\.)*[a-z0-9_-]+@[a-z0-9_-]+(\.[a-z0-9_-]+)*\.[a-z]{2,6}$/,
			valid: false
		}
	];

	(function() {
		inputsList.forEach(elem => {
			$('input[name="' + elem.name + '"]').on('input', () => runValidate([elem.name]));
		});
	})();

	function runValidate(inputNameArr) {
		inputNameArr.forEach(inputName => {
			let input = inputsList.find(input => input.name === inputName);
			let $target = $('input[name="' + inputName + '"]');
			let value = $target.val().trim();
			input.valid = input.pattern.test(value);
			let error = !input.valid;
			showError($target, error);
		});
	}

	function showError($target, error) {
		if ( error ) {
			$target.addClass('error');
			$target.removeClass('valid');
		} else {
			$target.removeClass('error');
			$target.addClass('valid');
		}
	}

	$('form').submit((e) => {
		e.preventDefault();
		let inputCnt = 0, validCnt = 0;
		inputsList.forEach(elem => {
			inputCnt ++;
			validCnt += (elem.valid ? 1 : 0);
		});
		if (validCnt === inputCnt) {
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
		} else {
			runValidate(['name', 'tel', 'email']);
		}
	});

});
