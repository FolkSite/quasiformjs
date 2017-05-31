/**
* @author https://quasi-art.ru
* @date 30.12.2014-07.02.2017
* @license GPLv2
*/

function recaptchaCallBack() {
    var recaptches = $('[data-quasiform="recaptcha"][data-sitekey][id]');
    $.each(recaptches, function (index, recaptcha) {
        var recaptchaOptions = {
            sitekey: null,
        };
        var sitekey = $(recaptcha).getAttribute('data-sitekey');
        if (sitekey !== undefined) {
            recaptchaOptions.sitekey = $(recaptcha).getAttribute('data-sitekey');
        }
        else {
            console.log('sitekey is undefined');
        }
        grecaptcha.render($(recaptcha).getAttribute('id'), recaptchaOptions);
    });
}
$.fn.quasiform = function (options) {
    $.fn.quasiform.options = $.extend({
        debug: false,
        format: 'json',
        formSelector: null,
        errorOpenTag: '<li>',
        errorCloseTag: '</li>',
        errorsOpenTag: '<ul>',
        errorsCloseTag: '</ul>',
        fieldErrorOpenTag: '<li>',
        fieldErrorCloseTag: '</li>',
        fieldErrorsOpenTag: '<ul>',
        fieldErrorsCloseTag: '</ul>',
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
    //var wrapper = $(this);
	var wrapper = document.querySelector('#' + $(this).attr('id'));
    var responseData = null;
    var options = $.fn.quasiform.options;
    /**
     * Если флажок установлен, то у кнопки отправки формы удаляется атрибут disabled.
     */
    var checkboxAgreeSelector = '[data-quasiform="agreement"]';
    var submitSelector = 'button[type="submit"]';
    var checkboxAgree = wrapper.querySelector(checkboxAgreeSelector);
    var button = wrapper.querySelector(submitSelector);
    if (checkboxAgree !== null && button !== null) {
        if (checkboxAgree.checked) {
            button.removeAttribute('disabled');
        }
        else {
            button.setAttribute('disabled', 'disabled');
        }
    }
    if (checkboxAgree !== null && typeof checkboxAgree == 'object') {
        checkboxAgree.addEventListener('change', function (e) {
            var button = wrapper.querySelector(submitSelector);
            if (button !== null && typeof button == 'object') {
                if (checkboxAgree.checked) {
                    button.removeAttribute('disabled');
                    if ('callbackOnAgree' in options && typeof options.callbackOnAgree == 'function') {
                        options.callbackOnAgree(wrapper);
                    }
                }
                else {
                    button.setAttribute('disabled', 'disabled');
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
    var checkboxes = wrapper.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach((checkbox, idx) => {
        var name = checkbox.getAttribute('name');
        var checked = checkbox.checked;
        var customCheckbox = wrapper.querySelector('[data-quasiform="checkbox"][data-name="' + name + '"]');
        if (customCheckbox !== null) {
            var classOff = customCheckbox.getAttribute('data-quasiform-checkbox-off');
            if (checked) {
                customCheckbox.classList.remove(classOff);
            }
            else {
                customCheckbox.classList.add(classOff);
            }
            $(checkbox).on('change', function (e) {
                var checked = checkbox.checked;
                if (checked) {
                    customCheckbox.classList.add(classOff);
                }
                else {
                    customCheckbox.classList.add(classOff);
                }
            });
        }
    });
    if (options.formSelector) {
        var form = wrapper.querySelector(options.formSelector);
    }
    else {
        var form = wrapper.querySelector('form');
    }

    if (form !== null && typeof form == 'object') {
        /**
         * Textarea Autoheight
         */
		var textareas = document.querySelectorAll('textarea[data-quasiform="autoheight"]');
        textareas.forEach((textarea, index) => {
            textarea.addEventListener('input', function (e) {
                textarea.style.height = '5px';
                textarea.style.height = (textarea.scrollHeight + 2) + 'px';
            });
        });
        /**
         * Star rating
         */
        var starsWrapper = wrapper.querySelector('[data-quasiform="stars"]');
        var field = wrapper.querySelector('input[name="stars"]');
        if (starsWrapper !== null && field !== null) {
            var starSelector = '[data-value]';
            var stars = starsWrapper.querySelectorAll('[data-value]');
            var starClassActive = 'quasiform-star--active';
            var value = parseInt(field.value);
            starsWrapper.querySelector(starSelector + '[data-value]').classList.remove(starClassActive);
            var i = 0;
            for (i = 1; i <= value; i++) {
                starsWrapper.querySelector('[data-value="' + i + '"]').classList.add(starClassActive);
            }
			stars.forEach((star, index) => {
				star.addEventListener('mouseover', function(e) {
					var value = parseInt(star.getAttribute('data-value'));
                	var i = 0;
                	for (i = 1; i <= stars.length; i++) {
						if (i <= value) {
                    		starsWrapper.querySelector('[data-value="' + i + '"]').classList.add(starClassActive);
						} else {
							starsWrapper.querySelector('[data-value="' + i + '"]').classList.remove(starClassActive);
						}
                	}
				});
				star.addEventListener('mousedown', function(e) {
					var value = parseInt(star.getAttribute('data-value'));
					var valueOld = field.value;
					if (value != valueOld) {
						field.value = value;
						if ('callbackOnStarsChange' in options && typeof options.callbackOnStarsChange == 'function') {
							options.callbackOnStarsChange(wrapper);
						}
					}
					return false;
				});
			});
            field.addEventListener('change', function (e) {
                var value = parseInt(field.value);
                starsWrapper.querySelector(starSelector + '[data-value]').classList.remove(starClassActive);
                var i = 0;
                for (i = 1; i <= value; i++) {
                    starsWrapper.querySelector('[data-value="' + i + '"]').classList.add(starClassActive);
                }
                if ('callbackOnStarsChange' in options && typeof options.callbackOnStarsChange == 'function') {
                    options.callbackOnStarsChange(wrapper);
                }
            });
            $(starsWrapper).mouseout(function (e) {
                starsWrapper.querySelector('[data-value]').classList.remove(starClassActive);
                var value = parseInt(field.value);
                if (value > 0) {
                    var i = 0;
                    for (i = 1; i <= value; i++) {
                        starsWrapper.querySelector('[data-value="' + i + '"]').classList.add(starClassActive);
                    }
                }
            });
        }
		
		var spinners = form.querySelectorAll('[data-quasiform="spinner"]');
		if (spinners.length > 0) {
			spinners.forEach((spinner, index) => {
				var increase = spinner.querySelector('[data-quasiform="spinner__increase"]');
				increase.addEventListener('mousedown', function(e) {
					console.log('A');
					var button = $(this);
					var min = parseInt(spinner.getAttribute('data-min'));
					var max = parseInt(spinner.getAttribute('data-max'));
					var input = spinner.querySelector('input');
					var valueOld = parseInt(input.value);
					var step = parseInt(spinner.getAttribute('data-one'));
					var k = 1;
					var valueNew = valueOld + step * k;
					if (valueNew <= max) {
						input.value = valueNew;
					}
				});
				
				var decrease = spinner.querySelector('[data-quasiform="spinner__decrease"]');
				decrease.addEventListener('mousedown', function(e) {
					console.log('B');
					var button = $(this);
					var min = parseInt(spinner.getAttribute('data-min'));
					var max = parseInt(spinner.getAttribute('data-max'));
					var input = spinner.querySelector('input');
					var valueOld = parseInt(input.value);
					var step = parseInt(spinner.getAttribute('data-one'));
					var k = -1;
					var valueNew = valueOld + step * k;
					if (valueNew >= min) {
						input.value = valueNew;
					}
				});
			});
		}
		
        form.addEventListener('submit', function(e) {
            var messagesWrapperSelector = '[data-quasiform="messages"]';
            var errorsWrapperSelector = '[data-quasiform="errors"]';
            var loaderSelector = '[data-quasiform="loader"]';
            wrapper.querySelector(errorsWrapperSelector).style.display = 'none';
            wrapper.querySelector(messagesWrapperSelector).style.display = 'none';
            var formD = $(form)[0];
            var formData = new FormData(formD);
            //var formData = $(form).serialize();
            var formAction = form.getAttribute('action');
            var formType = form.getAttribute('method');
            form.querySelector(submitSelector).setAttribute('disabled', 'disabled');
            wrapper.querySelector(loaderSelector).style.display = 'block';
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
                complete: function () {
                    // Функция, которую нужно исполнить после завершения запроса
                    if ('callbackOnComplete' in options && typeof options.callbackOnComplete == 'function') {
                        options.callbackOnComplete(wrapper);
                    }
                    wrapper.querySelector(loaderSelector).style.display = 'none';
                    //form.querySelector(submitSelector).classList.remove('disabled');
		            form.querySelector(submitSelector).removeAttribute('disabled');
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    if (xhr.status == 404) {
                        console.log('Ресурс ' + formAction + ' не найден');
                    }
                    else if (xhr.status == 500) {
                        console.log('Ошибка 500');
                    }
                    else if (xhr.status == 200) {
                        console.log('Статус 200');
                        console.log('Невалидный JSON');
                    }
                    else {
                        console.log('Ошибка ' + xhr.status);
                    }
                    // Функция, которую нужно исполнить, если сервер вернул невалидный JSON или код не 200
                    if ('callbackOnError' in options && typeof options.callbackOnError == 'function') {
                        options.callbackOnError(wrapper);
                    }
                },
                success: function (data, textStatus) {
                    if (options.format == 'json' && typeof data == 'object' && data !== null) {
                        wrapper.responseData = data;
                        // Вывод сообщений об ошибках
                        if ('errors' in data && Array.isArray(data.errors)) {
                            if (data.errors.length > 0) {
                                var errorsList = '';
                                for (i = 0; i < data.errors.length; i++) {
                                    if (data.errors[i].length > 0) {
                                        errorsList += options.errorOpenTag + data.errors[i] + options.errorCloseTag;
                                    }
                                }
                                errorsList = options.errorsOpenTag + errorsList + options.errorsCloseTag;
                                wrapper.querySelector(errorsWrapperSelector).innerHTML = errorsList;
                                wrapper.querySelector(errorsWrapperSelector).style.display = 'block';
                            }
                        }
                        // Вывод информационных сообщений
                        if ('messages' in data && Array.isArray(data.messages)) {
                            if (data.messages.length > 0) {
                                var messagesList = '';
                                for (i = 0; i < data.messages.length; i++) {
                                    if (data.messages[i].length > 0) {
                                        messagesList += options.messageOpenTag + data.messages[i] + options.messageCloseTag;
                                    }
                                }
                                messagesList = options.messagesOpenTag + messagesList + options.messagesCloseTag;
                                wrapper.querySelector(messagesWrapperSelector).innerHTML = messagesList;
                                wrapper.querySelector(messagesWrapperSelector).style.display = 'block';
                            }
                        }
                        if ('field_errors' in data && typeof data.field_errors == 'object' && data.field_errors !== null) {
                            var fieldName;
                            for (fieldName in data.field_errors) {
                                var input = wrapper.querySelector('input[name="' + fieldName + '"]');
								if (input !== null) {
									input.classList.add(options.hasErrorInputClass);
								}
                                var textarea = wrapper.querySelector('textarea[name="' + fieldName + '"]');
								if (textarea !== null) {
									textarea.classList.add(options.hasErrorInputClass);
								}
                                var label = wrapper.querySelector('label[for="' + fieldName + '"]');
								if (label !== null) {
									label.classList.add(options.hasErrorLabelClass);
								}
                                
                                if (data.field_errors[fieldName].length > 0) {
                                    var fieldErrorsList = '';
                                    for (i = 0; i < data.field_errors[fieldName].length; i++) {
                                        fieldErrorsList += options.fieldErrorOpenTag + data.field_errors[fieldName][i] + options.fieldErrorCloseTag;
                                    }
                                    fieldErrorsList = options.fieldErrorsOpenTag + errorsList + options.fieldErrorsCloseTag;
                                    $('[data-quasiform-field-errors="'+fieldName+'"]').innerHTML = fieldErrorsList;
                                    $('[data-quasiform-field-errors="'+fieldName+'"]').style.display = 'block';
                                }
                            }
                        }
                        if (options.hideFormOnSuccess && 'success' in data && data.success) {
                            formstyle.display = 'none';
                        }
                        if ('success' in data) {
                            if (data.success) {
                                // Функция, которую нужно исполнить после успеха
                                if ('callbackOnSuccess' in options && typeof options.callbackOnSuccess == 'function') {
                                    options.callbackOnSuccess(wrapper);
                                }
                            }
                            else {
                                // Функция, которую нужно исполнить после неуспешного запроса
                                if ('callbackOnFail' in options && typeof options.callbackOnFail == 'function') {
                                    options.callbackOnFail(wrapper);
                                }
                            }
                        }
                        else {
                            if (options.debug) {
                                console.log('Ответ сервера не содержит поле success');
                            }
                        }
                    }
                    else if (options.format == 'html' && typeof data == 'string') {
                        wrapper.querySelector('[data-quasiform="html"]').innerHTML = data;
                        wrapper.querySelector('[data-quasiform="html"]').style.display = 'block';
                    }
                    else {
                        if (options.debug) {
                            console.log('Ответ сервера имеет неверный формат');
                        }
                    }
                }
            });
            e.preventDefault();
        });
    } else {
        console.log('Form not found');
    }
    return this;
};
