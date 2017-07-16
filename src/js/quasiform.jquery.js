'use strict';

require('whatwg-fetch');
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
    recaptches.forEach((recaptcha) => {
      const recaptchaOptions = {
        sitekey: null,
      };
      const sitekey = recaptcha.getAttribute('data-sitekey');
      if (sitekey !== undefined) {
        recaptchaOptions.sitekey = recaptcha.getAttribute('data-sitekey');
      } else {
        console.log('sitekey is undefined');
      }
      /* eslint-disable no-undef */
      grecaptcha.render(recaptcha.getAttribute('id'), recaptchaOptions);
      /* eslint-enable no-undef */
    });
  }
};

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
    callbackOnline: null,
    callbackOffline: null,
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
    isOnline: true,
    response: null,
  };

  if (options.formSelector) {
    this.form = this.wrapper.querySelector(options.formSelector) || false;
  } else {
    this.form = this.wrapper.querySelector('form') || false;
  }

  this.initCheckboxes = () => {
    const checkboxes = this.wrapper.querySelectorAll('input[type="checkbox"]') || false;
    if (NodeList.prototype.isPrototypeOf(checkboxes)) {
      checkboxes.forEach((checkbox) => {
        const name = checkbox.getAttribute('name');
        const checked = checkbox.checked;
        const customCheckbox = this.wrapper.querySelector(`[data-quasiform="checkbox"][data-name="${name}"]`) || false;
        if (customCheckbox) {
          const classOff = customCheckbox.getAttribute('data-quasiform-checkbox-off') || false;
          if (checked) {
            customCheckbox.classList.remove(classOff);
          } else {
            customCheckbox.classList.add(classOff);
          }
          checkbox.addEventListener('change', () => {
            const checked = checkbox.checked;
            if (checked) {
              customCheckbox.classList.remove(classOff);
            } else {
              customCheckbox.classList.add(classOff);
            }
          });
        }
      });
    }
    
    const checkboxAgreeSelector = '[data-quasiform="agreement"]';
    const checkboxAgree = this.wrapper.querySelector(checkboxAgreeSelector) || false;
    if (checkboxAgree) {
      if (checkboxAgree.checked) {
        this.setState({ agree: true });
      }
      checkboxAgree.addEventListener('change', () => {
        if (checkboxAgree.checked) {
          if ('callbackOnAgree' in this.options && this.isFunction(this.options.callbackOnAgree)) {
            this.options.callbackOnAgree(this.wrapper);
          }
        } else {
          if ('callbackOnDisagree' in this.options && this.isFunction(this.options.callbackOnDisagree)) {
            this.options.callbackOnDisagree(this.wrapper);
          }
        }
        this.setState({
          agree: checkboxAgree.checked
        });
      });
    } else {
      this.setState({ agree: true });
    }
  };

  this.initStars = () => {
    const starsWrapper = this.wrapper.querySelector('[data-quasiform="stars"]') || false;
    const field = this.wrapper.querySelector('input[name="stars"]');
    if (starsWrapper) {
      const starSelector = '[data-value]';
      const stars = starsWrapper.querySelectorAll('[data-value]') || false;
      const starClassActive = 'quasiform-star--active';
      const value = parseInt(field.value);
      starsWrapper.querySelector(`${starSelector}[data-value]`).classList.remove(starClassActive);
      for (let i = 1; i <= value; i++) {
        starsWrapper.querySelector('[data-value="' + i + '"]').classList.add(starClassActive);
      }
      stars.forEach((star) => {
        star.addEventListener('mouseover', () => {
          const value = parseInt(star.getAttribute('data-value'));
          const l = stars.length;
          for (let i = 1; i <= l; i++) {
            if (i <= value) {
              starsWrapper.querySelector('[data-value="' + i + '"]').classList.add(starClassActive);
            } else {
              starsWrapper.querySelector('[data-value="' + i + '"]').classList.remove(starClassActive);
            }
          }
        });
        star.addEventListener('mousedown', () => {
          const value = parseInt(star.getAttribute('data-value'));
          const valueOld = field.value;
          if (value != valueOld) {
            field.value = value;
            if ('callbackOnStarsChange' in this.options && this.isFunction(this.options.callbackOnStarsChange)) {
              this.options.callbackOnStarsChange(this.wrapper);
            }
          }
          return false;
        });
      });
      field.addEventListener('change', () => {
        const value = parseInt(field.value);
        const stars = starsWrapper.querySelectorAll(`${starSelector}[data-value]`) || false;
        if (NodeList.prototype.isPrototypeOf(stars)) {
          stars.forEach((star) => {
            star.classList.remove(starClassActive);
          });
        }
        for (let i = 1; i <= value; i++) {
          let star = starsWrapper.querySelector(`[data-value="${i}"]`) || false;
          if (star) {
            starsWrapper.querySelector(`[data-value="${i}"]`).classList.add(starClassActive);
          }
        }
        if ('callbackOnStarsChange' in this.options && this.isFunction(this.options.callbackOnStarsChange)) {
          this.options.callbackOnStarsChange(this.wrapper);
        }
      });
      starsWrapper.addEventListener('mouseout', () => {
        starsWrapper.querySelector('[data-value]').classList.remove(starClassActive);
        const l = starsWrapper.querySelectorAll('[data-value]').length;
        const value = parseInt(field.value);
        if (value > 0) {
          for (let i = 1; i <= l; i++) {
            if (i <= value) {
              starsWrapper.querySelector(`[data-value="${i}"]`).classList.add(starClassActive);
            } else {
              starsWrapper.querySelector(`[data-value="${i}"]`).classList.remove(starClassActive);
            }
          }
        }
      });
    }
  };

  this.initSpinners = () => {
    const spinners = this.form.querySelectorAll('[data-quasiform="spinner"]') || false;
    if (NodeList.prototype.isPrototypeOf(spinners)) {
      spinners.forEach((spinner) => {
        const decrease = spinner.querySelector('[data-quasiform="spinner__decrease"]') || false;
        decrease.addEventListener('mousedown', () => {
          const min = parseInt(spinner.getAttribute('data-min'));
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
        increase.addEventListener('mousedown', () => {
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
  };

  this.initTextareas = () => {
    const textareas = this.wrapper.querySelectorAll('textarea[data-quasiform="autoheight"]') || false;
    if (NodeList.prototype.isPrototypeOf(textareas)) {
      textareas.forEach((textarea) => {
        textarea.addEventListener('input', () => {
          textarea.style.height = '5px';
          textarea.style.height = (textarea.scrollHeight + 2) + 'px';
        });
      });
    }
  };
  
  this.render = () => {
    const submitSelector = 'button[type="submit"]';
    const submitButton = this.wrapper.querySelector(submitSelector) || false;
    if (submitButton) {
      if (!this.state.loading && this.state.agree) {
        submitButton.removeAttribute('disabled');
      } else {
        submitButton.setAttribute('disabled', true);
      }
    }

    const messagesWrapperSelector = '[data-quasiform="messages"]';
    const errorsWrapperSelector = '[data-quasiform="errors"]';
    const errorsWrapper = this.wrapper.querySelector(errorsWrapperSelector) || false;
    const messagesWrapper = this.wrapper.querySelector(messagesWrapperSelector) || false;
    if (errorsWrapper) {
      errorsWrapper.style.display = 'none';
    }
    if (messagesWrapper) {
      messagesWrapper.style.display = 'none';
    }

    const loaderSelector = '[data-quasiform="loader"]';
    const loader = this.wrapper.querySelector(loaderSelector) || false;
    if (loader) {
      if (this.state.loading) {
        loader.style.display = 'block';
      } else {
        loader.style.display = 'none';
      }
    }
 
    // Вывод сообщений об ошибках
    if (this.isObject(this.state.response)) {
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
      // Display errors in fields
      if ('field_errors' in data && this.isObject(data.field_errors)) {
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
            if (this.isObject(errorLabel)) {
              errorLabel.innerHTML = fieldErrorsList;
              errorLabel.style.display = 'block';
            }
          }
        }
      }
    }
  };
  
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
  };
  
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
  };
  
  this.initCustomFileInput = (selector) => {
    const inputWrapper = this.wrapper.querySelector(selector) || false;
    if (this.isObject(inputWrapper)) {
      const input = inputWrapper.querySelector('input') || false;
      const span = inputWrapper.querySelector('span') || false;
      if (input) {
        input.style.display = 'none';
        input.addEventListener('change', (e) => {
          let fileName = '';
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
  };

  this.isElement = variable => variable instanceof Element;
  
  this.isObject = variable => typeof variable === 'object' && variable !== null;
  
  this.isFunction = variable => typeof variable === 'function';

  this.setState = (patch) => {
    let newState = Object.assign(this.state, patch);
    this.state = newState;
    this.render();
  };

  this.handleOnlineStatus = () => {
    const isOnline = navigator.onLine;
    this.setState({
      isOnline: isOnline
    });
    if (isOnline && 'callbackOnline' in this.options && this.isFunction(this.options.callbackOnline)) {
      this.options.callbackOnline(this.wrapper);
    }
    if (!isOnline && 'callbackOffline' in this.options && this.isFunction(this.options.callbackOffline)) {
      this.options.callbackOffline(this.wrapper);
    }
  };
  
  this.start = () => {
    window.addEventListener('online',  this.handleOnlineStatus);
    window.addEventListener('offline', this.handleOnlineStatus);

    if (this.form) {
      this.initCheckboxes();
      this.initTextareas();
      this.initStars();
      this.initSpinners();
      this.initCustomFileInput('[data-quasiform="input-file"]');
      this.form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = new FormData(this.form);
        const formAction = this.form.getAttribute('action');
        const formMethod = this.form.getAttribute('method');
        this.setState({
          loading: true,
          response: null
        });
        // Функция, которую нужно исполнить перед запросом
        if ('callbackBeforeSend' in this.options && this.isFunction(this.options.callbackBeforeSend)) {
          this.options.callbackBeforeSend(this.wrapper);
        }
        
        const headers = {};
        fetch(formAction, {headers: headers, method: formMethod, body: formData})
        .then((response) => {
          // Функция, которую нужно исполнить после завершения запроса
          if ('callbackOnComplete' in this.options && this.isFunction(this.options.callbackOnComplete)) {
            this.options.callbackOnComplete(this.wrapper);
          }
          this.setState({
            loading: false
          });
          switch (this.options.format) {
          case 'json':
            return response.json();
          case 'html':
            return response.text();
          }
        })
        .then((data) => {
          if (this.options.format === 'json' && this.isObject(data)) {
            this.wrapper.responseData = data;
            this.setState({
              loading: false,
              response: data
            });
  
            if (this.options.hideFormOnSuccess && 'success' in data && data.success) {
              this.form.style.display = 'none';
            }
            if ('success' in data) {
              if (data.success) {
                // Функция, которую нужно исполнить после успеха
                if ('callbackOnSuccess' in this.options && this.isFunction(this.options.callbackOnSuccess)) {
                  this.options.callbackOnSuccess(this.wrapper);
                }
              }
              else {
                // Функция, которую нужно исполнить после неуспешного запроса
                if ('callbackOnFail' in this.options && this.isFunction(this.options.callbackOnFail)) {
                  this.options.callbackOnFail(this.wrapper);
                }
              }
            }
            else {
              if (options.debug) {
                console.log('Ответ сервера не содержит поле success');
              }
            }
          } else if (options.format === 'html' && typeof data === 'string') {
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
  };

  this.start();

  return this;
};
