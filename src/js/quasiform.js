/**
 * @author https://quasi-art.ru
 * @date 30.12.2014-26.10.2016
 * @license GPLv2
 */

function recaptchaCallBack() {
    var recaptches = $('[data-quasiform="recaptcha"][data-sitekey][id]');
    $.each(recaptches, function(index, recaptcha) {
        var recaptchaOptions = {};
        var sitekey = $(recaptcha).attr('data-sitekey');
        if (sitekey !== undefined) {
            recaptchaOptions.sitekey = $(recaptcha).attr('data-sitekey');
        }
        grecaptcha.render($(recaptcha).attr('id'), recaptchaOptions);
    });
}

(function ($) {
	$.fn.quasiform = function(options) {
		// Настройки
		$.fn.quasiform.options = $.extend({
			debug: true,

			errorOpenTag: '<li>',
			errorCloseTag: '</li>',
			errorsOpenTag: '<ul>',
			errorsCloseTag: '</ul>',

			messageOpenTag: '<li>',
			messageCloseTag: '</li>',
			messagesOpenTag: '<ul>',
			messagesCloseTag: '</ul>',

			hideFormOnSuccess: true,
		}, options);

		// Обёртка (внутри находятся сообщения и форма)
		var wrapper = $(this);
		
		wrapper.on('change', '[data-quasiform="agreement"]', function(e) {
			console.log('checkbox');
			var checked = $(this).is(':checked');
			if (checked) {
				form.find('button[type="submit"]').removeAttr('disabled');
			} else {
				form.find('button[type="submit"]').attr('disabled', true);
			}
		});

		var form = $(wrapper).find('form').slice(0, 1);
		if (form.length === 1) {
			$(form).on('submit', function(e) {
				var messagesWrapperSelector = '[data-quasiform="messages"]';
				var errorsWrapperSelector = '[data-quasiform="errors"]';
				var loaderSelector = '[data-quasiform="loader"]';
				var formData = new FormData($(form)[0]);
				var formAction = $(form).attr('action');
				var formType = $(form).attr('method');
				form.find('button[type="submit"]').attr('disabled', true);
				wrapper.find(loaderSelector).show();
				$.ajax({
					//contentType: false,
					processData: false,
					data: formData,
					dataType: 'json',
					type: formType,
					url: formAction,
					complete: function() {
						wrapper.find(loaderSelector).hide();
						form.find('button[type="submit"]').removeAttr('disabled');
					},
					error: function(xhr, ajaxOptions, thrownError) {
						if (xhr.status == 404) {
							console.log('Ресурс ' + formAction + ' не найден');
						} else if (xhr.status == 500) {
							console.log('Ошибка 500');
						} else if (xhr.status == 200) {
							console.log('Статус 200');
							console.log('Невалидный JSON');
						} else {
							console.log('Ошибка ' + xhr.status);
						}
					},
					success: function(data, textStatus) {
						if (typeof data == 'object' && data !== null) {
							// Вывод сообщений об ошибках
							wrapper.find(errorsWrapperSelector).hide();
							if ('errors' in data && $.isArray(data.errors)) {
								if (data.errors.length > 0) {
									var errorsList = '';
									for (i = 0; i < data.errors.length; i++) {
										if (data.errors[i].length > 0) {
											errorsList += $.fn.quasiform.options.errorOpenTag + data.errors[i] + $.fn.quasiform.options.errorCloseTag;
										}
									}
									errorsList = $.fn.quasiform.options.errorsOpenTag + errorsList + $.fn.quasiform.options.errorsCloseTag;
									wrapper.find(errorsWrapperSelector).html(errorsList).show();
								}
							}
							// Вывод информационных сообщений
							wrapper.find(messagesWrapperSelector).hide();
							if ('messages' in data && $.isArray(data.messages)) {
								if (data.messages.length > 0) {
									var messagesList = '';
									for (i = 0; i < data.messages.length; i++) {
										if (data.messages[i].length > 0) {
											messagesList += $.fn.quasiform.options.messageOpenTag + data.messages[i] + $.fn.quasiform.options.messageCloseTag;
										}
									}
									messagesList = $.fn.quasiform.options.messagesOpenTag + messagesList + $.fn.quasiform.options.messagesCloseTag;
									wrapper.find(messagesWrapperSelector).html(messagesList).show();
								}
							}
							if ($.fn.quasiform.options.hideFormOnSuccess && 'success' in data && data.success) {
								form.hide();
							}
						} else {
							console.log('Ответ сервера имеет неверный формат');
						}
					}
				});
				e.preventDefault();
			});
		}

		return this;
	};
}($));