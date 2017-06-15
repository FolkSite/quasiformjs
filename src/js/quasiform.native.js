'use strict';

/**
 * @author https://quasi-art.ru
 * @date 30.12.2014-07.02.2017
 * @license GPLv2
 */

function recaptchaCallBack() {
    var recaptches = $('[data-quasiform="recaptcha"][data-sitekey][id]');
    $.each(recaptches, function(index, recaptcha) {
        var recaptchaOptions = {
            sitekey: null,
        };
        var sitekey = $(recaptcha).getAttribute('data-sitekey');
        if (sitekey !== undefined) {
            recaptchaOptions.sitekey = $(recaptcha).getAttribute('data-sitekey');
        } else {
            console.log('sitekey is undefined');
        }
        grecaptcha.render($(recaptcha).getAttribute('id'), recaptchaOptions);
    });
}

/*(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['quasiform'], factory(root));
    } else if (typeof exports === 'object') {
        module.exports = factory(require('quasiform'));
    } else {
        root.quasiform = factory(root, root.buoy);
    }
})(typeof global !== 'undefined' ? global : this.window || this.global, function(root) {*/
    

    class quasiform {
        constructor(args) {
            let instance = this;
            this.defaults = {
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
                selector: '',
            };
            this.options = {};
            this.wrapper = null;
            this.form = null;
            this.responseData = null;
            this.options = this.extendDefaults(this.defaults, args || {});
            this.wrapper = document.querySelector(this.options.selector);
            if (typeof this.wrapper !== 'object' || this.wrapper === null) {
                return false;
            }

            var checkboxAgreeSelector = '[data-quasiform="agreement"]';
            var submitSelector = 'button[type="submit"]';
            var checkboxAgree = this.wrapper.querySelector(checkboxAgreeSelector);
            let button = this.wrapper.querySelector(submitSelector);
            /**
             * Если флажок установлен, то у кнопки отправки формы удаляется атрибут disabled.
             */
            if (checkboxAgree !== null && button !== null) {
                if (checkboxAgree.checked) {
                    button.removeAttribute('disabled');
                } else {
                    button.setAttribute('disabled', 'disabled');
                }
            }
            if (checkboxAgree !== null && typeof checkboxAgree == 'object') {
                checkboxAgree.addEventListener('change', function(e) {
                    let button = instance.wrapper.querySelector(submitSelector);
                    if (button !== null && typeof button == 'object') {
                        if (checkboxAgree.checked) {
                            button.removeAttribute('disabled');
                            if ('callbackOnAgree' in instance.options && typeof instance.options.callbackOnAgree == 'function') {
                                instance.options.callbackOnAgree(instance.wrapper);
                            }
                        } else {
                            button.setAttribute('disabled', 'disabled');
                            if ('callbackOnDisagree' in instance.options && typeof instance.options.callbackOnDisagree == 'function') {
                                instance.options.callbackOnDisagree(instance.wrapper);
                            }
                        }
                    }
                });
            }

            /**
             * Custom checkbox
             */
            var checkboxes = this.wrapper.querySelectorAll('input[type="checkbox"]');
            if (checkboxes.length > 0) {
                [].forEach.call(checkboxes, function(checkbox, idx) {
                    var name = checkbox.getAttribute('name');
                    var checked = checkbox.checked;
                    var customCheckbox = instance.wrapper.querySelector('[data-quasiform="checkbox"][data-name="' + name + '"]');
                    if (customCheckbox !== null) {
                        var classOff = customCheckbox.getAttribute('data-quasiform-checkbox-off');
                        if (checked) {
                            customCheckbox.classList.remove(classOff);
                        } else {
                            customCheckbox.classList.add(classOff);
                        }
                        checkbox.addEventListener('change', function() {
                            var checked = checkbox.checked;
                            if (checked) {
                                customCheckbox.classList.remove(classOff);
                            } else {
                                customCheckbox.classList.add(classOff);
                            }
                        });
                    }
                });
            }
            if (this.options.formSelector) {
                this.form = this.wrapper.querySelector(instance.options.formSelector);
            } else {
                this.form = this.wrapper.querySelector('form');
            }

            if (this.form !== null && typeof this.form == 'object') {
                /**
                 * Textarea Autoheight
                 */
                var textareas = this.wrapper.querySelectorAll('textarea[data-quasiform="autoheight"]');
                if (textareas.length > 0) {
                    [].forEach.call(textareas, function(textarea, idx) {
                        textarea.addEventListener('input', function(e) {
                            textarea.style.height = '5px';
                            textarea.style.height = (textarea.scrollHeight + 2) + 'px';
                        });
                    });
                }
                /**
                 * Star rating
                 */
                var starsWrapper = this.wrapper.querySelector('[data-quasiform="stars"]');
                var field = this.wrapper.querySelector('input[name="stars"]');
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
                                if ('callbackOnStarsChange' in instance.options && typeof instance.options.callbackOnStarsChange == 'function') {
                                    instance.options.callbackOnStarsChange(instance.wrapper);
                                }
                            }
                            return false;
                        });
                    });
                    field.addEventListener('change', function(e) {
                        var value = parseInt(field.value);
                        starsWrapper.querySelector(starSelector + '[data-value]').classList.remove(starClassActive);
                        var i = 0;
                        for (i = 1; i <= value; i++) {
                            starsWrapper.querySelector('[data-value="' + i + '"]').classList.add(starClassActive);
                        }
                        if ('callbackOnStarsChange' in instance.options && typeof instance.options.callbackOnStarsChange == 'function') {
                            instance.options.callbackOnStarsChange(instance.wrapper);
                        }
                    });
                    starsWrapper.addEventListener('mouseout', function(e) {
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

                var spinners = this.form.querySelectorAll('[data-quasiform="spinner"]');
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

                this.initCustomFileInput('[data-quasiform="input-file"]');

                this.form.addEventListener('submit', function(e) {
                    e.preventDefault();
                    var messagesWrapperSelector = '[data-quasiform="messages"]';
                    var errorsWrapperSelector = '[data-quasiform="errors"]';
                    var loaderSelector = '[data-quasiform="loader"]';
                    instance.wrapper.querySelector(errorsWrapperSelector).style.display = 'none';
                    instance.wrapper.querySelector(messagesWrapperSelector).style.display = 'none';
                    var formData = new FormData(instance.form);
                    //var formData = $(form).serialize();
                    var formAction = instance.form.getAttribute('action');
                    var formMethod = instance.form.getAttribute('method');
                    instance.form.querySelector(submitSelector).setAttribute('disabled', 'disabled');
                    instance.wrapper.querySelector(loaderSelector).style.display = 'block';
                    instance.responseData = null;
                    // Функция, которую нужно исполнить перед запросом
                    if ('callbackBeforeSend' in instance.options && typeof instance.options.callbackBeforeSend == 'function') {
                        instance.options.callbackBeforeSend(instance.wrapper);
                    }

                    var headers = {
                        
                    };
                    fetch(formAction, {
                            headers: headers,
                            method: formMethod,
                            body: formData
                        })
                        .then(response => {
                            // Функция, которую нужно исполнить после завершения запроса
                            if ('callbackOnComplete' in instance.options && typeof instance.options.callbackOnComplete == 'function') {
                                instance.options.callbackOnComplete(instance.wrapper);
                            }
                            instance.wrapper.querySelector(loaderSelector).style.display = 'none';
                            instance.form.querySelector(submitSelector).removeAttribute('disabled');
                            switch (instance.options.format) {
                                case 'json':
                                    return response.json();
                                    break;
                                case 'html':
                                    return response.text();
                                    break;
                                default:
                                    break;
                            }
                        })
                        .then(function(data) {
                            if (instance.options.format == 'json' && typeof data == 'object' && data !== null) {
                                instance.wrapper.responseData = data;
                                // Вывод сообщений об ошибках
                                if ('errors' in data && Array.isArray(data.errors)) {
                                    let l = data.errors.length;
                                    if (l > 0) {
                                        let errorsList = '';
                                        for (i = 0; i < l; i++) {
                                            if (data.errors[i].length > 0) {
                                                errorsList += instance.options.errorOpenTag + data.errors[i] + instance.options.errorCloseTag;
                                            }
                                        }
                                        errorsList = instance.options.errorsOpenTag + errorsList + instance.options.errorsCloseTag;
                                        instance.wrapper.querySelector(errorsWrapperSelector).innerHTML = errorsList;
                                        instance.wrapper.querySelector(errorsWrapperSelector).style.display = 'block';
                                    }
                                }
                                // Display info messages
                                if ('messages' in data && Array.isArray(data.messages)) {
                                    if (data.messages.length > 0) {
                                        let messagesList = '';
                                        let l = data.messages.length;
                                        for (i = 0; i < l; i++) {
                                            if (data.messages[i].length > 0) {
                                                messagesList += instance.options.messageOpenTag + data.messages[i] + instance.options.messageCloseTag;
                                            }
                                        }
                                        messagesList = instance.options.messagesOpenTag + messagesList + instance.options.messagesCloseTag;
                                        instance.wrapper.querySelector(messagesWrapperSelector).innerHTML = messagesList;
                                        instance.wrapper.querySelector(messagesWrapperSelector).style.display = 'block';
                                    }
                                }
                                // Display errors in fields
                                if ('field_errors' in data && typeof data.field_errors == 'object' && data.field_errors !== null) {
                                    let fieldName;
                                    for (fieldName in data.field_errors) {
                                        let input = instance.wrapper.querySelector('input[name="' + fieldName + '"]');
                                        if (input !== null) {
                                            input.classList.add(instance.options.hasErrorInputClass);
                                        }
                                        let textarea = instance.wrapper.querySelector('textarea[name="' + fieldName + '"]');
                                        if (textarea !== null) {
                                            textarea.classList.add(instance.options.hasErrorInputClass);
                                        }
                                        let label = instance.wrapper.querySelector('label[for="' + fieldName + '"]');
                                        if (label !== null) {
                                            label.classList.add(instance.options.hasErrorLabelClass);
                                        }

                                        if (data.field_errors[fieldName].length > 0) {
                                            let fieldErrorsList = '';
                                            let l = data.field_errors[fieldName].length;
                                            for (i = 0; i < l; i++) {
                                                fieldErrorsList += instance.options.fieldErrorOpenTag + data.field_errors[fieldName][i] + instance.options.fieldErrorCloseTag;
                                            }
                                            fieldErrorsList = instance.options.fieldErrorsOpenTag + fieldErrorsList + instance.options.fieldErrorsCloseTag;
                                            let errorLabel = instance.wrapper.querySelector('[data-quasiform-field-errors="' + fieldName + '"]');
                                            if (typeof errorLabel === 'object' && errorLabel !== null) {
                                                errorLabel.innerHTML = fieldErrorsList;
                                                errorLabel.style.display = 'block';
                                            }
                                        }
                                    }
                                }
                                if (instance.options.hideFormOnSuccess && 'success' in data && data.success) {
                                    instance.form.style.display = 'none';
                                }
                                if ('success' in data) {
                                    if (data.success) {
                                        // Функция, которую нужно исполнить после успеха
                                        if ('callbackOnSuccess' in instance.options && typeof instance.options.callbackOnSuccess == 'function') {
                                            instance.options.callbackOnSuccess(instance.wrapper);
                                        }
                                    } else {
                                        // Функция, которую нужно исполнить после неуспешного запроса
                                        if ('callbackOnFail' in instance.options && typeof instance.options.callbackOnFail == 'function') {
                                            instance.options.callbackOnFail(instance.wrapper);
                                        }
                                    }
                                } else {
                                    if (instance.options.debug) {
                                        console.log('Ответ сервера не содержит поле success');
                                    }
                                }
                            } else if (instance.options.format == 'html' && typeof data == 'string') {
                                var htmlView = instance.wrapper.querySelector('[data-quasiform="html"]');
                                if (typeof htmlView == 'object' && htmlView !== null) {
                                    htmlView.innerHTML = data;
                                    htmlView.style.display = 'block';
                                }
                            } else {
                                if (instance.options.debug) {
                                    console.log('Ответ сервера имеет неверный формат: ' + typeof data);
                                }
                            }
                        })
                        .catch(err => console.error(err));
                });
            } else {
                console.log('Form not found, wrapper id: ' + this.wrapper.id);
            }
        }

        extendDefaults(source, properties) {
            var property;
            for (property in properties) {
                if (properties.hasOwnProperty(property)) {
                    source[property] = properties[property];
                }
            }
            return source;
        }

        initCustomFileInput(selector) {
            if (this.options.debug) {
                console.log('initCustomFileInput(' + selector + ')');
            }
            var inputWrapper = this.wrapper.querySelector(selector);
            if (typeof inputWrapper == 'object' && inputWrapper !== null) {
                var input = inputWrapper.querySelector('input');
                var span = inputWrapper.querySelector('span');
                input.style.display = 'none';
                input.addEventListener('change', function(e) {
                    var fileName = '';
                    if (this.files && this.files.length > 1) {
                        fileName = (this.getAttribute('data-multiple-caption') || '').replace('{count}', this.files.length);
                    } else {
                        fileName = e.target.value.split('\\').pop();
                    }
                    if (fileName) {
                        span.innerHTML = fileName;
                    }
                });
            }
        }



    }
/*
    return quasiform;
});*/