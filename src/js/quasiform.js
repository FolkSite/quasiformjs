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
        } else {
			console.log('sitekey is undefined');
		}
        grecaptcha.render($(recaptcha).attr('id'), recaptchaOptions);
    });
}

$.fn.quasiform = function(options) {
	$.fn.quasiform.options = $.extend({
		debug: false,
		format: 'json', // json, html
		formSelector: null,

		errorOpenTag: '<li>',
		errorCloseTag: '</li>',
		errorsOpenTag: '<ul>',
		errorsCloseTag: '</ul>',

		messageOpenTag: '<li>',
		messageCloseTag: '</li>',
		messagesOpenTag: '<ul>',
		messagesCloseTag: '</ul>',

		hideFormOnSuccess: false,
        
        hasErrorInputClass: 'quasiform__form-input--has-error',
        hasErrorLabelClass: 'quasiform__form-label--has-error',

		callbackOnSuccess: null,
		callbackOnFail: null,
		callbackOnError: null,
		callbackOnComplete: null,
		callbackBeforeSend: null,
		callbackOnAgree: null,
		callbackOnDisagree: null,
		callbackOnStarsChange: null,
	}, options);

	// Обёртка (внутри находятся сообщения и форма)
	var wrapper = $(this);
    var responseData = null;
	var options = $.fn.quasiform.options;

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
					if ('callbackOnAgree' in options && typeof options.callbackOnAgree == 'function') {
						options.callbackOnAgree(wrapper);
					}
    			} else {
    				button.attr('disabled', true);
					if ('callbackOnDisagree' in options && typeof options.callbackOnDisagree == 'function') {
						options.callbackOnDisagree(wrapper);
					}
    			}
			}
		});
    }
	
	/**
	 * Custom checkbox
	 */
	var checkboxes = $(wrapper).find('input[type="checkbox"]');
	$(checkboxes).each(function(idx, e) {
		var checkbox = $(e);
		var name = checkbox.attr('name');
		var checked = checkbox.is(':checked');
		var customCheckbox = $(wrapper).find('[data-quasiform="checkbox"][data-name="'+name+'"]');
		if (customCheckbox.length == 1) {
			var classOff = customCheckbox.attr('data-quasiform-checkbox-off');
			if (checked) {
				customCheckbox.removeClass(classOff);
			} else {
				customCheckbox.addClass(classOff);
			}
			$(checkbox).on('change', function(e) {
				var checked = checkbox.is(':checked');
				if (checked) {
					customCheckbox.removeClass(classOff);
				} else {
					customCheckbox.addClass(classOff);
				}
			});
		}
	});

	if (options.formSelector) {
		var form = $(wrapper).find(options.formSelector).slice(0, 1);
	} else {
		var form = $(wrapper).find('form').slice(0, 1);
	}
	
	if (form.length === 1) {
		/**
		 * Textarea Autoheight
		 */
		var textarea = $(form).find('textarea[data-quasiform="autoheight"]');
		$.each(textarea, function(e) {
			$(textarea).on('input', function(e) {
				var textarea = $(this);
				textarea.css('height', '5px');
				textarea.css('height', (textarea.prop('scrollHeight') + 2) + 'px');
			});
		});

		/**
		 * Star rating
		 */
		var starsWrapper = $(wrapper).find('[data-quasiform="stars"]');
		var field = $(wrapper).find('input[name="stars"]');
		if (starsWrapper.length == 1 && field.length > 0) {
			var starSelector = '[data-value]';
			var stars = $(starsWrapper).find('[data-value]');
			var starClassActive = 'quasiform-star--active';
			
			var value = parseInt(field.val());
			$(starsWrapper).find(starSelector + '[data-value]').removeClass(starClassActive);
			var i = 0;
			for (i = 1; i <= value; i++) {
				$(starsWrapper).find('[data-value="' + i + '"]').addClass(starClassActive);
			}
			
			$(stars).hover(function(e) {
				var star = $(this);
				var starsWrapper = star.parent();
				var value = parseInt(star.attr('data-value'));
				$(starsWrapper).find('[data-value]').removeClass(starClassActive);
				var i = 0;
				for (i = 1; i <= value; i++) {
					$(starsWrapper).find('[data-value="' + i + '"]').addClass(starClassActive);
				}
			});
			$(stars).click(function(e) {
				var star = $(this);
				var value = parseInt(star.attr('data-value'));
				var valueOld = field.val();
				if (value != valueOld) {
					field.val(value);
					if ('callbackOnStarsChange' in options && typeof options.callbackOnStarsChange == 'function') {
						options.callbackOnStarsChange(wrapper);
					}
				}
				e.preventDefault();
			});
			$(field).change(function(e) {
				var value = parseInt(field.val());
				$(starsWrapper).find(starSelector + '[data-value]').removeClass(starClassActive);
				var i = 0;
				for (i = 1; i <= value; i++) {
					$(starsWrapper).find('[data-value="' + i + '"]').addClass(starClassActive);
				}
				if ('callbackOnStarsChange' in options && typeof options.callbackOnStarsChange == 'function') {
					options.callbackOnStarsChange(wrapper);
				}
			});
			$(starsWrapper).mouseout(function(e) {
				$(starsWrapper).find('[data-value]').removeClass(starClassActive);
				var value = parseInt(field.val());
				if (value > 0) {
					var i = 0;
					for (i = 1; i <= value; i++) {
						$(starsWrapper).find('[data-value="' + i + '"]').addClass(starClassActive);
					}
				}
			});
		}
		
		$(form).on('submit', function(e) {
			var messagesWrapperSelector = '[data-quasiform="messages"]';
			var errorsWrapperSelector = '[data-quasiform="errors"]';
			var loaderSelector = '[data-quasiform="loader"]';
			
			wrapper.find(errorsWrapperSelector).hide();
			wrapper.find(messagesWrapperSelector).hide();
			
			var formData = new FormData($(form)[0]);
			//var formData = $(form).serialize();
			
			var formAction = $(form).attr('action');
			var formType = $(form).attr('method');
			form.find(submitSelector).attr('disabled', true);
			wrapper.find(loaderSelector).show();
            responseData = null;
			
			// Функция, которую нужно исполнить перед запросом
			if ('callbackBeforeSend' in options && typeof options.callbackBeforeSend == 'function') {
				options.callbackBeforeSend(wrapper);
			}
			
			$.ajax({
				contentType: false,
				processData: false,
				data: formData,
				dataType: options.format,
				type: formType,
				url: formAction,
				complete: function() {
					// Функция, которую нужно исполнить после завершения запроса
					if ('callbackOnComplete' in options && typeof options.callbackOnComplete == 'function') {
						options.callbackOnComplete(wrapper);
					}
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
					// Функция, которую нужно исполнить, если сервер вернул невалидный JSON или код не 200
					if ('callbackOnError' in options && typeof options.callbackOnError == 'function') {
						options.callbackOnError(wrapper);
					}
				},
				success: function(data, textStatus) {
					if (options.format == 'json' && typeof data == 'object' && data !== null) {
                        wrapper.responseData = data;
						// Вывод сообщений об ошибках
						if ('errors' in data && $.isArray(data.errors)) {
							if (data.errors.length > 0) {
								var errorsList = '';
								for (i = 0; i < data.errors.length; i++) {
									if (data.errors[i].length > 0) {
										errorsList += options.errorOpenTag + data.errors[i] + options.errorCloseTag;
									}
								}
								errorsList = options.errorsOpenTag + errorsList + options.errorsCloseTag;
								wrapper.find(errorsWrapperSelector).html(errorsList).fadeIn(10);
							}
						}
						// Вывод информационных сообщений
						
						if ('messages' in data && $.isArray(data.messages)) {
							if (data.messages.length > 0) {
								var messagesList = '';
								for (i = 0; i < data.messages.length; i++) {
									if (data.messages[i].length > 0) {
										messagesList += options.messageOpenTag + data.messages[i] + options.messageCloseTag;
									}
								}
								messagesList = options.messagesOpenTag + messagesList + options.messagesCloseTag;
								wrapper.find(messagesWrapperSelector).html(messagesList).fadeIn(10);
							}
						}
                        if ('field_errors' in data && typeof data.field_errors == 'object' && data.field_errors !== null) {
                            for (fieldName in data.field_errors) {
                                wrapper.find('input[name="'+fieldName+'"]').addClass(options.hasErrorInputClass);
                                wrapper.find('textarea[name="'+fieldName+'"]').addClass(options.hasErrorInputClass);
                                wrapper.find('label[for="'+fieldName+'"]').addClass(options.hasErrorLabelClass);
                            }
                        }
						if (options.hideFormOnSuccess && 'success' in data && data.success) {
							form.hide();
						}
                        
                        if ('success' in data) {
                            if (data.success) {
                                // Функция, которую нужно исполнить после успеха
                                if ('callbackOnSuccess' in options && typeof options.callbackOnSuccess == 'function') {
                                    options.callbackOnSuccess(wrapper);
                                }
                            } else {
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
					} else if (options.format == 'html' && typeof data == 'string') {
						wrapper.find('[data-quasiform="html"]').html(data).fadeIn(10);
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
