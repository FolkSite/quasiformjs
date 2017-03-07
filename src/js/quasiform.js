/**
 * @author https://quasi-art.ru
 * @date 30.12.2014-07.02.2017
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

$.fn.quasiform = function(options) {
	// Настройки
	$.fn.quasiform.options = $.extend({
		debug: false,

		errorOpenTag: '<li>',
		errorCloseTag: '</li>',
		errorsOpenTag: '<ul>',
		errorsCloseTag: '</ul>',

		messageOpenTag: '<li>',
		messageCloseTag: '</li>',
		messagesOpenTag: '<ul>',
		messagesCloseTag: '</ul>',

		hideFormOnSuccess: false,
        
        hasErrorInputClass: 'quasiform-form__input--has-error',
        hasErrorLabelClass: 'quasiform-form__input--has-error',
        
        showOnSuccess: '', // Селектор элемента, который нужно показать в случае успешной отправки формы
		hideOnSuccess: '', // Селектор элемента, который нужно скрыть в случае успешной отправки формы
		showOnFail: '', // Селектор элемента, который нужно показать в случае неуспешной отправки формы
		hideOnFail: '', // Селектор элемента, который нужно скрыть в случае неуспешной отправки формы
        
		callbackOnSuccess: null,
		callbackOnFail: null,
	}, options);

	// Обёртка (внутри находятся сообщения и форма)
	var wrapper = $(this);
    var responseData = null;

	/**
     * Если флажок установлен, то у кнопки отправки формы удаляется атрибут disabled.
     */
    var checkboxAgreeSelector = '[data-quasiform="agreement"]';
    var submitSelector = 'button[type="submit"]';
    var checkboxAgree = wrapper.find(checkboxAgreeSelector).slice(0, 1);
    var button = wrapper.find(submitSelector).slice(0, 1);
    if (checkboxAgree.length == 1 && button.length == 1) {
        if (checkboxAgree.is(':checked')) {
            button.removeAttr('disabled');
        } else {
            button.attr('disabled', true);
        }
    }
    if (checkboxAgree.length == 1) {
		wrapper.on('change', checkboxAgreeSelector, function(e) {
            var button = wrapper.find(submitSelector).slice(0, 1);
            if (button.length == 1) {
    			if ($(this).is(':checked')) {
    				button.removeAttr('disabled');
    			} else {
    				button.attr('disabled', true);
    			}
			}
		});
    }

	var form = $(wrapper).find('form').slice(0, 1);
	if (form.length === 1) {
		$(form).on('submit', function(e) {
			var messagesWrapperSelector = '[data-quasiform="messages"]';
			var errorsWrapperSelector = '[data-quasiform="errors"]';
			var loaderSelector = '[data-quasiform="loader"]';
			
			var formData = new FormData($(form)[0]);
			//var formData = $(form).serialize();
			
			var formAction = $(form).attr('action');
			var formType = $(form).attr('method');
			form.find(submitSelector).attr('disabled', true);
			wrapper.find(loaderSelector).show();
            responseData = null;
			$.ajax({
				contentType: false,
				processData: false,
				data: formData,
				dataType: 'json',
				type: formType,
				url: formAction,
				complete: function() {
					wrapper.find(loaderSelector).hide();
					form.find(submitSelector).removeAttr('disabled');
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
                        wrapper.responseData = data;
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
                        if ('field_errors' in data && typeof data.field_errors == 'object' && data.field_errors !== null) {
                            for (fieldName in data.field_errors) {
                                wrapper.find('input[name="'+fieldName+'"]').addClass(options.hasErrorInputClass);
                                wrapper.find('textarea[name="'+fieldName+'"]').addClass(options.hasErrorInputClass);
                                wrapper.find('label[for="'+fieldName+'"]').addClass(options.hasErrorLabelClass);
                            }
                        }
						if ($.fn.quasiform.options.hideFormOnSuccess && 'success' in data && data.success) {
							form.hide();
						}
                        
                        if ('success' in data) {
                            if (data.success) {
                                // Элемент, который нужно показать после успеха
                                if (typeof options.showOnSuccess == 'string' && options.showOnSuccess.length > 0) {
                                    $(options.showOnSuccess).show();
                                }
                                // Элемент, который нужно скрыть после успеха
                                if (typeof options.hideOnSuccess == 'string' && options.hideOnSuccess.length > 0) {
                                    $(options.hideOnSuccess).hide();
                                }
                                // Функция, которую нужно исполнить после успеха
                                if ('callbackOnSuccess' in options && typeof options.callbackOnSuccess == 'function') {
                                    options.callbackOnSuccess(wrapper);
                                }
                            } else {
                                // Элемент, который нужно показать после неуспешного запроса
                                if (typeof options.showOnFail == 'string' && options.showOnFail.length > 0) {
                                    $(options.showOnFail).show();
                                }
                                // Элемент, который нужно скрыть после неуспешного запроса
                                if (typeof options.hideOnFail == 'string' && options.hideOnFail.length > 0) {
                                    $(options.hideOnFail).hide();
                                }
                                // Функция, которую нужно исполнить после неуспешного запроса
                                if ('callbackOnFail' in options && typeof options.callbackOnFail == 'function') {
                                    options.callbackOnFail(wrapper);
                                }
                            }
                        } else {
                            if (options.debug) {
		                         console.log('Ответ сервера не содержит поле success');
                            }
                        }
					} else {
                        if (options.debug) {
	                         console.log('Ответ сервера имеет неверный формат');
                        }
					}
				}
			});
			e.preventDefault();
		});
	}

	return this;
};
