'use strict';

/* eslint-disable no-unused-vars */
import quasiform from '../src/js/quasiform.jquery.js';
/* eslint-enable no-unused-vars */

function initForms() {
  /**
   * Form does not exists
   */
  const optionsNotExists = {
    hideFormOnSuccess: false,
  };
  $('#ne').quasiform(optionsNotExists);
  
  /**
   * Offline
   */
  const optionsOffline = {
    hideFormOnSuccess: false,
    callbackOffline: (wrapper) => {
      console.log('callbackOffline');
      console.debug(wrapper);
    },
    callbackOnline: (wrapper) => {
      console.log('callbackOnline');
      console.debug(wrapper);
    }
  };
  $('#offline').quasiform(optionsOffline);
  
  /**
   * Spinner
   */
  const optionsSpinner = {
    hideFormOnSuccess: false,
  };
  $('#spinner').quasiform(optionsSpinner);
  
  /**
   * Нулевая форма
   */
  const optionsPost = {
    debug: true,
    format: 'html',
    hasErrorInputClass: 'quasiform-form__input--has-error',
    hasErrorLabelClass: 'quasiform-form__label--has-error',
    hideFormOnSuccess: false,
    callbackOnSuccess: (wrapper) => {
      console.log('callbackOnSuccess');
      console.debug(wrapper);
    },
    callbackOnFail: (wrapper) => {
      console.log('callbackOnFail');
      console.debug(wrapper);
    },
    callbackOnError: (wrapper) => {
      console.log('callbackOnError');
      console.debug(wrapper);
    },
    callbackBeforeSend: (wrapper) => {
      console.log('callbackBeforeSend');
      console.debug(wrapper);
    },
    callbackOnComplete: (wrapper) => {
      console.log('callbackOnComplete');
      console.debug(wrapper);
    },
  };
  $('#post').quasiform(optionsPost);

  /**
   * Первая форма
   */
  const optionsSuccess = {
    debug: true,
    hasErrorInputClass: 'quasiform-form__input--has-error',
    hasErrorLabelClass: 'quasiform-form__label--has-error',
    hideFormOnSuccess: false,
    callbackOnSuccess: (wrapper) => {
      console.log('callbackOnSuccess');
      console.debug(wrapper);
    },
    callbackOnFail: (wrapper) => {
      console.log('callbackOnFail');
      console.debug(wrapper);
    },
    callbackOnError: (wrapper) => {
      console.log('callbackOnError');
      console.debug(wrapper);
    },
    callbackBeforeSend: (wrapper) => {
      console.log('callbackBeforeSend');
      console.debug(wrapper);
    },
    callbackOnComplete: (wrapper) => {
      console.log('callbackOnComplete');
      console.debug(wrapper);
    },
  };
  $('#success').quasiform(optionsSuccess);

  /**
   * Вторая форма
   */
  const optionsFail = {
    debug: true,
    hasErrorInputClass: 'quasiform-form__input--has-error',
    hasErrorLabelClass: 'quasiform-form__label--has-error',
    hideFormOnSuccess: false,
    callbackOnSuccess: (wrapper) => {
      console.log('callbackOnSuccess');
      console.debug(wrapper);
    },
    callbackOnFail: (wrapper) => {
      console.log('callbackOnFail');
      console.debug(wrapper);
    },
    callbackOnError: (wrapper) => {
      console.log('callbackOnError');
      console.debug(wrapper);
    },
    callbackBeforeSend: (wrapper) => {
      console.log('callbackBeforeSend');
      console.debug(wrapper);
    },
    callbackOnComplete: (wrapper) => {
      console.log('callbackOnComplete');
      console.debug(wrapper);
    },
  };
  $('#fail').quasiform(optionsFail);

  /**
   * Звёзды
   */
  const optionsStars = {
    debug: true,
    hideFormOnSuccess: false,
    callbackOnStarsChange: (wrapper) => {
      console.log('callbackOnStarsChange');
      console.debug(wrapper);
    }
  };
  $('#stars').quasiform(optionsStars);

  /**
   * Чекбокс
   */
  const optionsCheckbox = {
    debug: true,
    hideFormOnSuccess: false,
    callbackOnAgree: (wrapper) => {
      console.log('agree');
      console.debug(wrapper);
    },
    callbackOnDisagree: (wrapper) => {
      console.log('disagree');
      console.debug(wrapper);
    }
  };
  $('#checkbox').quasiform(optionsCheckbox);
  
  /**
   * HTML-ответ
   */
  const optionsHtml = {
    debug: true,
    format: 'html',
    hideFormOnSuccess: false,
    callbackOnAgree: (wrapper) => {
      console.log('agree');
      console.debug(wrapper);
    },
    callbackOnDisagree: (wrapper) => {
      console.log('disagree');
      console.debug(wrapper);
    }
  };
  $('#html').quasiform(optionsHtml);
}

if (document.readyState === 'complete' || document.readyState !== 'loading') {
  initForms();
} else {
  document.addEventListener('DOMContentLoaded', initForms);
}