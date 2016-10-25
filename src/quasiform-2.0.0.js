(function ($) {
    $.fn.quasiform = function(options) {
        var config = $.extend({
			debug: true,
        }, options);

		var wrapper = $(this);
		var form = $(wrapper).find('form').slice(0, 1);
		if (form.length === 1) {
			$(form).on('submit', function(e) {
				var messagesWrapperSelector = '[data-quasiform="messages"]';
				var errorsWrapperSelector = '[data-quasiform="errors"]';
				var formData = new FormData($(form)[0]);
				var formAction = $(form).attr('action');
				var formType = $(form).attr('method');
				$.ajax({
					contentType: false,
					processData: false,
					data: formData,
					dataType: 'json',
					type: formType,
					url: formAction,
					complete: function() {
						form.find('button[type="submit"]').removeAttr('disabled');
					},
					error: function(xhr, ajaxOptions, thrownError) {
						if (xhr.status == 404) {
							console.log('Ресурс ' + formAction + ' не найден');
						} else if (xhr.status == 500) {
							console.log('Ошибка 500');
						} else {
							console.log('Ошибка ' + xhr.status);
						}
					},
					success: function(data, textStatus) {
						if (typeof data == 'object') {
							errorsList = '';
							messagesList = '';
							wrapper.find(errorsWrapperSelector).hide();
							wrapper.find(messagesWrapperSelector).hide();
							if ('errors' in data) {
								if (data.errors.length > 0) {
									for (i = 0; i < data.errors.length; i++) {
										errorsList += '<li>' + data.errors[i] + '</li>';
									}
									errorsList = '<ul>' + errorsList + '</ul>';
								}
							}
							if ('messages' in data) {
								if (data.messages.length > 0) {
									for (i = 0; i < data.messages.length; i++) {
										messagesList += '<li>' + data.messages[i] + '</li>';
									}
									messagesList = '<ul>' + messagesList + '</ul>';
								}
							}
							if (data.success) {
								wrapper.find(messagesWrapperSelector).html(messagesList).fadeIn('fast');
								$(form).fadeOut('fast').remove();
							} else {
								wrapper.find(errorsWrapperSelector).html(errorsList).fadeIn('fast');
								for (var fieldName in data.field_errors) {
									var fieldErrorsList = '';
									var fieldErorrs = data.field_errors[fieldName];
									for (i = 0; i < fieldErorrs.length; i++) {
										fieldErrorsList += '<p>' + fieldErorrs[i] + '</p>';
									}
								}
								$(form).find('button[type="submit"]').removeAttr('disabled');
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