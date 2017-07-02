"use strict";

import 'whatwg-fetch';
require('es6-promise/auto');
require('es6-symbol/implement');

/**
* @author https://quasi-art.ru
* @date 30.12.2014-07.02.2017
* @license GPLv2
*/

window.recaptchaCallBack = () => {
    var recaptches = document.querySelectorAll('[data-quasiform="recaptcha"][data-sitekey][id]');
	[].forEach.call(recaptches, function(recaptcha, index) {
        var recaptchaOptions = {
            sitekey: null,
        };
        var sitekey = recaptcha.getAttribute('data-sitekey');
        if (sitekey !== undefined) {
            recaptchaOptions.sitekey = recaptcha.getAttribute('data-sitekey');
        } else {
            console.log('sitekey is undefined');
        }
        grecaptcha.render(recaptcha.getAttribute('id'), recaptchaOptions);
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
    var wrapper = document.querySelector('#' + $(this).attr('id'));
    if (typeof wrapper !== 'object' || wrapper === null) {
        return false;
    }
    var responseData = null;
    var options = $.fn.quasiform.options;
    /**
     * Если флажок установлен, то у кнопки отправки формы удаляется атрибут disabled.
     */
    var checkboxAgreeSelector = '[data-quasiform="agreement"]';
    var submitSelector = 'button[type="submit"]';
    var checkboxAgree = wrapper.querySelector(checkboxAgreeSelector);
    let button = wrapper.querySelector(submitSelector);
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
            let button = wrapper.querySelector(submitSelector);
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
    if (checkboxes.length > 0) {
        [].forEach.call(checkboxes, function(checkbox, idx) {
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
                checkbox.addEventListener('change', function () {
                    var checked = checkbox.checked;
                    if (checked) {
                        customCheckbox.classList.remove(classOff);
                    }
                    else {
                        customCheckbox.classList.add(classOff);
                    }
                });
            }
        });
    }
    if (options.formSelector) {
        var form = wrapper.querySelector(options.formSelector);
    } else {
        var form = wrapper.querySelector('form');
    }

    if (form !== null && typeof form == 'object') {
        /**
         * Textarea Autoheight
         */
        var textareas = wrapper.querySelectorAll('textarea[data-quasiform="autoheight"]');
        if (textareas.length > 0) {
            [].forEach.call(textareas, function(textarea, idx) {
                textarea.addEventListener('input', function (e) {
                    textarea.style.height = '5px';
                    textarea.style.height = (textarea.scrollHeight + 2) + 'px';
                });
            });
        }
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
            [].forEach.call(stars, function(star, idx) {
                star.addEventListener('mouseover', function(e) {
                    var value = parseInt(star.getAttribute('data-value'));
                    var i = 0;
                    let l = stars.length;
                    for (i = 1; i <= l; i++) {
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
            starsWrapper.addEventListener('mouseout', function (e) {
                starsWrapper.querySelector('[data-value]').classList.remove(starClassActive);
                var l = starsWrapper.querySelectorAll('[data-value]').length;
                var value = parseInt(field.value);
                if (value > 0) {
                    var i = 0;
                    for (i = 1; i <= l; i++) {
                        if (i <= value) {
                            starsWrapper.querySelector('[data-value="' + i + '"]').classList.add(starClassActive);
                        } else {
                            starsWrapper.querySelector('[data-value="' + i + '"]').classList.remove(starClassActive);
                        }
                    }
                }
            });
        }
        
        var spinners = form.querySelectorAll('[data-quasiform="spinner"]');
        if (spinners.length > 0) {
            [].forEach.call(spinners, function(spinner, idx) {
                var decrease = spinner.querySelector('[data-quasiform="spinner__decrease"]');
                decrease.addEventListener('mousedown', function(e) {
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
                
                var increase = spinner.querySelector('[data-quasiform="spinner__increase"]');
                increase.addEventListener('mousedown', function(e) {
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
            });
        }
        
        initCustomFileInput('[data-quasiform="input-file"]');
        
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            var messagesWrapperSelector = '[data-quasiform="messages"]';
            var errorsWrapperSelector = '[data-quasiform="errors"]';
            var loaderSelector = '[data-quasiform="loader"]';
            wrapper.querySelector(errorsWrapperSelector).style.display = 'none';
            wrapper.querySelector(messagesWrapperSelector).style.display = 'none';
            var formData = new FormData(form);
            //var formData = $(form).serialize();
            var formAction = form.getAttribute('action');
            var formMethod = form.getAttribute('method');
            form.querySelector(submitSelector).setAttribute('disabled', 'disabled');
            wrapper.querySelector(loaderSelector).style.display = 'block';
            responseData = null;
            // Функция, которую нужно исполнить перед запросом
            if ('callbackBeforeSend' in options && typeof options.callbackBeforeSend == 'function') {
                options.callbackBeforeSend(wrapper);
            }
            
            var headers = {}; //var headers = new Headers();
            switch (options.format) {
                case 'json':
                    //headers.append('Content-Type', 'application/json; charset=utf-8');
                    //headers.append('Cache-Control', 'no-cache');
                    //headers.append('Content-Type', 'multipart/form-data');
                    break;
                case 'html':
                    break;
            }
            fetch(formAction, {headers: headers, method: formMethod, body: formData})
            .then(response => {
                // Функция, которую нужно исполнить после завершения запроса
                if ('callbackOnComplete' in options && typeof options.callbackOnComplete == 'function') {
                    options.callbackOnComplete(wrapper);
                }
                wrapper.querySelector(loaderSelector).style.display = 'none';
                form.querySelector(submitSelector).removeAttribute('disabled');
                switch (options.format) {
                    case 'json':
                        return response.json();
                    case 'html':
                        return response.text();
                }
            })
            .then(function(data) {
                if (options.format == 'json' && typeof data == 'object' && data !== null) {
                    wrapper.responseData = data;
                    // Вывод сообщений об ошибках
                    if ('errors' in data && Array.isArray(data.errors)) {
                        let l = data.errors.length;
                        if (l > 0) {
                            let errorsList = '';
                            for (i = 0; i < l; i++) {
                                if (data.errors[i].length > 0) {
                                    errorsList += options.errorOpenTag + data.errors[i] + options.errorCloseTag;
                                }
                            }
                            errorsList = options.errorsOpenTag + errorsList + options.errorsCloseTag;
                            wrapper.querySelector(errorsWrapperSelector).innerHTML = errorsList;
                            wrapper.querySelector(errorsWrapperSelector).style.display = 'block';
                        }
                    }
                    // Display info messages
                    if ('messages' in data && Array.isArray(data.messages)) {
                        if (data.messages.length > 0) {
                            let messagesList = '';
                            let l = data.messages.length;
                            for (i = 0; i < l; i++) {
                                if (data.messages[i].length > 0) {
                                    messagesList += options.messageOpenTag + data.messages[i] + options.messageCloseTag;
                                }
                            }
                            messagesList = options.messagesOpenTag + messagesList + options.messagesCloseTag;
                            wrapper.querySelector(messagesWrapperSelector).innerHTML = messagesList;
                            wrapper.querySelector(messagesWrapperSelector).style.display = 'block';
                        }
                    }
                    // Display errors in fields
                    if ('field_errors' in data && typeof data.field_errors == 'object' && data.field_errors !== null) {
                        let fieldName;
                        for (fieldName in data.field_errors) {
                            let input = wrapper.querySelector('input[name="' + fieldName + '"]');
                            if (input !== null) {
                                input.classList.add(options.hasErrorInputClass);
                            }
                            let textarea = wrapper.querySelector('textarea[name="' + fieldName + '"]');
                            if (textarea !== null) {
                                textarea.classList.add(options.hasErrorInputClass);
                            }
                            let label = wrapper.querySelector('label[for="' + fieldName + '"]');
                            if (label !== null) {
                                label.classList.add(options.hasErrorLabelClass);
                            }
                            
                            if (data.field_errors[fieldName].length > 0) {
                                let fieldErrorsList = '';
                                let l = data.field_errors[fieldName].length;
                                for (i = 0; i < l; i++) {
                                    fieldErrorsList += options.fieldErrorOpenTag + data.field_errors[fieldName][i] + options.fieldErrorCloseTag;
                                }
                                fieldErrorsList = options.fieldErrorsOpenTag + fieldErrorsList + options.fieldErrorsCloseTag;
                                let errorLabel = wrapper.querySelector('[data-quasiform-field-errors="'+fieldName+'"]');
                                if (typeof errorLabel === 'object' && errorLabel !== null) {
                                    errorLabel.innerHTML = fieldErrorsList;
                                    errorLabel.style.display = 'block';
                                }
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
                        console.log('Ответ сервера имеет неверный формат: ' + typeof data);
                    }
                }
            })
            .catch(err => console.error(err));
        });
    } else {
        console.log('Form not found, wrapper id: ' + wrapper.id);
    }
    
    function initCustomFileInput(selector) {
        if (options.debug) {
            console.log('initCustomFileInput('+selector+')');
        }
        var inputWrapper = wrapper.querySelector(selector);
        if (typeof inputWrapper == 'object' && inputWrapper !== null) {
            var input = inputWrapper.querySelector('input');
            var span = inputWrapper.querySelector('span');
            input.style.display = 'none';
            input.addEventListener('change', function(e) {
                var fileName = '';
                if (this.files && this.files.length > 1) {
                    fileName = ( this.getAttribute( 'data-multiple-caption' ) || '' ).replace( '{count}', this.files.length );
                } else {
                    fileName = e.target.value.split( '\\' ).pop();
                }
                if (fileName) {
                    span.innerHTML = fileName;
                }
            });
        }
    }
    
    return this;
};
