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
  const recaptches = document.querySelectorAll('[data-quasiform="recaptcha"][data-sitekey][id]');
  if (Array.isArray(recaptches)) {
  	recaptches.forEach((recaptcha, index) => {
      const recaptchaOptions = {
          sitekey: null,
      };
      const sitekey = recaptcha.getAttribute('data-sitekey');
      if (sitekey !== undefined) {
          recaptchaOptions.sitekey = recaptcha.getAttribute('data-sitekey');
      } else {
          console.log('sitekey is undefined');
      }
      grecaptcha.render(recaptcha.getAttribute('id'), recaptchaOptions);
    });
  }
}

$.fn.quasiform = function(options) {
  this.options = $.extend({
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
  this.wrapper = document.querySelector('#' + $(this).attr('id')) || false;
  if (!this.wrapper) {
    return false;
  }
  this.state = {
    agree: false,
    loading: false,
    response: null,
  };
  /**
   * Если флажок установлен, то у кнопки отправки формы удаляется атрибут disabled.
   */
  
  if (options.formSelector) {
      this.form = this.wrapper.querySelector(options.formSelector) || false;
  } else {
      this.form = this.wrapper.querySelector('form') || false;
  }

  this.initCheckboxes = () => {
    const checkboxes = this.wrapper.querySelectorAll('input[type="checkbox"]');
    if (NodeList.prototype.isPrototypeOf(checkboxes)) {
        checkboxes.forEach((checkbox, idx) => {
            var name = checkbox.getAttribute('name');
            var checked = checkbox.checked;
            var customCheckbox = this.wrapper.querySelector('[data-quasiform="checkbox"][data-name="' + name + '"]');
            if (customCheckbox !== null) {
                var classOff = customCheckbox.getAttribute('data-quasiform-checkbox-off');
                if (checked) {
                    customCheckbox.classList.remove(classOff);
                }
                else {
                    customCheckbox.classList.add(classOff);
                }
                checkbox.addEventListener('change', (e) => {
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
  }

  this.initStars = () => {
    var starsWrapper = this.wrapper.querySelector('[data-quasiform="stars"]') || false;
    var field = this.wrapper.querySelector('input[name="stars"]');
    if (starsWrapper) {
        var starSelector = '[data-value]';
        var stars = starsWrapper.querySelectorAll('[data-value]') || false;
        var starClassActive = 'quasiform-star--active';
        var value = parseInt(field.value);
        starsWrapper.querySelector(starSelector + '[data-value]').classList.remove(starClassActive);
        for (let i = 1; i <= value; i++) {
            starsWrapper.querySelector('[data-value="' + i + '"]').classList.add(starClassActive);
        }
        stars.forEach((star, idx) => {
            star.addEventListener('mouseover', (e) => {
                var value = parseInt(star.getAttribute('data-value'));
                let l = stars.length;
                for (let i = 1; i <= l; i++) {
                    if (i <= value) {
                        starsWrapper.querySelector('[data-value="' + i + '"]').classList.add(starClassActive);
                    } else {
                        starsWrapper.querySelector('[data-value="' + i + '"]').classList.remove(starClassActive);
                    }
                }
            });
            star.addEventListener('mousedown', (e) => {
                var value = parseInt(star.getAttribute('data-value'));
                var valueOld = field.value;
                if (value != valueOld) {
                    field.value = value;
                    if ('callbackOnStarsChange' in this.options && typeof this.options.callbackOnStarsChange == 'function') {
                        this.options.callbackOnStarsChange(this.wrapper);
                    }
                }
                return false;
            });
        });
        field.addEventListener('change', (e) => {
            const value = parseInt(field.value);
            starsWrapper.querySelector('${starSelector}[data-value]').classList.remove(starClassActive);
            for (let i = 1; i <= value; i++) {
              starsWrapper.querySelector(`[data-value="${i}"]`).classList.add(starClassActive);
            }
            if ('callbackOnStarsChange' in this.options && typeof this.options.callbackOnStarsChange == 'function') {
              this.options.callbackOnStarsChange(this.wrapper);
            }
        });
        starsWrapper.addEventListener('mouseout', (e) => {
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
  }

  this.initSpinners = () => {
    const spinners = this.form.querySelectorAll('[data-quasiform="spinner"]') || false;
    if (NodeList.prototype.isPrototypeOf(spinners)) {
      spinners.forEach((spinner, idx) => {
        const decrease = spinner.querySelector('[data-quasiform="spinner__decrease"]') || false;
        decrease.addEventListener('mousedown', (e) => {
          const min = parseInt(spinner.getAttribute('data-min'));
          const max = parseInt(spinner.getAttribute('data-max'));
          const input = spinner.querySelector('input');
          const valueOld = parseInt(input.value);
          const step = parseInt(spinner.getAttribute('data-one'));
          const k = -1;
          const valueNew = valueOld + step * k;
          if (valueNew >= min) {
            input.value = valueNew;
          }
        });
        
        const increase = spinner.querySelector('[data-quasiform="spinner__increase"]') || false;
        increase.addEventListener('mousedown', (e) => {
          const min = parseInt(spinner.getAttribute('data-min'));
          const max = parseInt(spinner.getAttribute('data-max'));
          const input = spinner.querySelector('input');
          const valueOld = parseInt(input.value);
          const step = parseInt(spinner.getAttribute('data-one'));
          const k = 1;
          const valueNew = valueOld + step * k;
          if (valueNew <= max) {
              input.value = valueNew;
          }
        });
      });
    }
  }

  this.initTextareas = () => {
    const textareas = this.wrapper.querySelectorAll('textarea[data-quasiform="autoheight"]') || false;
    if (NodeList.prototype.isPrototypeOf(textareas)) {
      textareas.forEach((textarea, idx) => {
        textarea.addEventListener('input', (e) => {
          textarea.style.height = '5px';
          textarea.style.height = (textarea.scrollHeight + 2) + 'px';
        });
      });
    }
  }
  
  this.render = () => {
    var messagesWrapperSelector = '[data-quasiform="messages"]';
    var errorsWrapperSelector = '[data-quasiform="errors"]';
    var loaderSelector = '[data-quasiform="loader"]';
    const checkboxAgreeSelector = '[data-quasiform="agreement"]';
    const submitSelector = 'button[type="submit"]';
    
    const checkboxAgreeSelector = '[data-quasiform="agreement"]';
    const submitSelector = 'button[type="submit"]';
    const checkboxAgree = this.wrapper.querySelector(checkboxAgreeSelector) || false;
    const button = this.wrapper.querySelector(submitSelector) || false;
    if (checkboxAgree) {
        if (checkboxAgree.checked) {
            button.removeAttribute('disabled');
        }
        else {
            button.setAttribute('disabled', 'disabled');
        }
    }
    if (checkboxAgree !== null && typeof checkboxAgree == 'object') {
        checkboxAgree.addEventListener('change', (e) => {
            let button = this.wrapper.querySelector(submitSelector);
            if (button !== null && typeof button == 'object') {
                if (checkboxAgree.checked) {
                    button.removeAttribute('disabled');
                    if ('callbackOnAgree' in this.options && typeof this.options.callbackOnAgree == 'function') {
                        this.options.callbackOnAgree(this.wrapper);
                    }
                }
                else {
                    button.setAttribute('disabled', 'disabled');
                    if ('callbackOnDisagree' in this.options && typeof this.options.callbackOnDisagree == 'function') {
                        this.options.callbackOnDisagree(this.wrapper);
                    }
                }
            }
        });
    }
    
    this.wrapper.querySelector(errorsWrapperSelector).style.display = 'none';
    this.wrapper.querySelector(messagesWrapperSelector).style.display = 'none';
    this.form.querySelector(submitSelector).setAttribute('disabled', 'disabled');
    if (this.state.loading) {
      this.wrapper.querySelector(loaderSelector).style.display = 'block';
    } else {
      this.wrapper.querySelector(loaderSelector).style.display = 'none';
    }
 
    // Вывод сообщений об ошибках
    if (typeof this.state.response === 'object' && this.state.response !== null) {
      let data = this.state.response;
      if ('errors' in data && Array.isArray(data.errors)) {
        let errorsList = this.renderErrors(data.errors);
        if (errorsList.length > 0) {
          this.wrapper.querySelector(errorsWrapperSelector).innerHTML = errorsList;
          this.wrapper.querySelector(errorsWrapperSelector).style.display = 'block';
        }
      }
      // Display info messages
      if ('messages' in data && Array.isArray(data.messages)) {
        if (data.messages.length > 0) {
          let messagesList = this.renderMessages(data.messages);
          if (messagesList.length > 0) {
            this.wrapper.querySelector(messagesWrapperSelector).innerHTML = messagesList;
            this.wrapper.querySelector(messagesWrapperSelector).style.display = 'block';
          }
        }
      }
    }

    if (button) {
      if (this.state.loading) {
        button.setAttribute('disabled', true);
      } else {
        button.setAttribute('disabled', false);
      }
    }
  }
  
  this.renderMessages = (messages) => {
    let output = '';
    if (Array.isArray(messages) && messages.length > 0) {
      messages.forEach((message) => {
        if (message.length > 0) {
          output += this.options.messageOpenTag + message + this.options.messageCloseTag;
        }
      });
      if (output.length > 0) {
        output = this.options.messagesOpenTag + output + this.options.messagesCloseTag;
      }
    }
    return output;
  }
  
  this.renderErrors = (errors) => {
    let output = '';
    if (Array.isArray(errors) && errors.length > 0) {
      errors.forEach((error) => {
        if (error.length > 0) {
          output += this.options.errorOpenTag + error + this.options.errorCloseTag;
        }
      });
      if (output.length > 0) {
        output = this.options.errorsOpenTag + output + this.options.errorsCloseTag;
      }
    }
    return output;
  }
  
  this.initCustomFileInput = (selector) => {
    var inputWrapper = this.wrapper.querySelector(selector);
    if (typeof inputWrapper == 'object' && inputWrapper !== null) {
      var input = inputWrapper.querySelector('input');
      var span = inputWrapper.querySelector('span');
      input.style.display = 'none';
      input.addEventListener('change', (e) => {
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

  this.setState = (patch) => {
    let newState = Object.assign(this.state, patch);
    this.render();
  }

  if (this.form) {
    this.initCheckboxes();
    this.initTextareas();
    this.initStars();
    this.initSpinners();
    this.initCustomFileInput('[data-quasiform="input-file"]');
    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.render();
      
      var formData = new FormData(this.form);
      var formAction = this.form.getAttribute('action');
      var formMethod = this.form.getAttribute('method');
      this.setState({ response: null });
      // Функция, которую нужно исполнить перед запросом
      if ('callbackBeforeSend' in this.options && typeof this.options.callbackBeforeSend === 'function') {
        this.options.callbackBeforeSend(this.wrapper);
      }
      
      const headers = {}; //var headers = new Headers();
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
      .then((response) => {
        // Функция, которую нужно исполнить после завершения запроса
        if ('callbackOnComplete' in this.options && typeof this.options.callbackOnComplete == 'function') {
          this.options.callbackOnComplete(this.wrapper);
        }
        //wrapper.querySelector(loaderSelector).style.display = 'none';
        this.setState({
          loading: false
        });
        this.form.querySelector(submitSelector).removeAttribute('disabled');
        switch (this.options.format) {
          case 'json':
            return response.json();
          case 'html':
            return response.text();
        }
      })
      .then((data) => {
        if (this.options.format === 'json' && typeof data == 'object' && data !== null) {
          this.wrapper.responseData = data;
          this.setState({
            loading: false,
            response: data
          });

          // Display errors in fields
          if ('field_errors' in data && typeof data.field_errors == 'object' && data.field_errors !== null) {
            for (let fieldName in data.field_errors) {
              let input = this.wrapper.querySelector('input[name="' + fieldName + '"]');
              if (input !== null) {
                input.classList.add(options.hasErrorInputClass);
              }
              let textarea = this.wrapper.querySelector('textarea[name="' + fieldName + '"]');
              if (textarea !== null) {
                textarea.classList.add(options.hasErrorInputClass);
              }
              let label = this.wrapper.querySelector('label[for="' + fieldName + '"]');
              if (label !== null) {
                label.classList.add(options.hasErrorLabelClass);
              }
              
              if (data.field_errors[fieldName].length > 0) {
                let fieldErrorsList = '';
                let l = data.field_errors[fieldName].length;
                for (let i = 0; i < l; i++) {
                  fieldErrorsList += this.options.fieldErrorOpenTag + data.field_errors[fieldName][i] + this.options.fieldErrorCloseTag;
                }
                fieldErrorsList = this.options.fieldErrorsOpenTag + fieldErrorsList + this.options.fieldErrorsCloseTag;
                let errorLabel = this.wrapper.querySelector('[data-quasiform-field-errors="'+fieldName+'"]');
                if (typeof errorLabel === 'object' && errorLabel !== null) {
                  errorLabel.innerHTML = fieldErrorsList;
                  errorLabel.style.display = 'block';
                }
              }
            }
          }
          if (this.options.hideFormOnSuccess && 'success' in data && data.success) {
            this.form.style.display = 'none';
          }
          if ('success' in data) {
            if (data.success) {
              // Функция, которую нужно исполнить после успеха
              if ('callbackOnSuccess' in this.options && typeof this.options.callbackOnSuccess === 'function') {
                this.options.callbackOnSuccess(this.wrapper);
              }
            }
            else {
              // Функция, которую нужно исполнить после неуспешного запроса
              if ('callbackOnFail' in this.options && typeof this.options.callbackOnFail === 'function') {
                this.options.callbackOnFail(this.wrapper);
              }
            }
          }
          else {
            if (options.debug) {
              console.log('Ответ сервера не содержит поле success');
            }
          }
        } else if (options.format == 'html' && typeof data == 'string') {
          this.wrapper.querySelector('[data-quasiform="html"]').innerHTML = data;
          this.wrapper.querySelector('[data-quasiform="html"]').style.display = 'block';
        } else {
          if (options.debug) {
            console.log('Ответ сервера имеет неверный формат: ' + typeof data);
          }
        }
      })
      .catch(err => console.error(err));
    });
  } else {
    console.log('Form not found, wrapper id: ' + this.wrapper.id);
    return this;
  }

  return this;
};
