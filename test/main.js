import 'whatwg-fetch';
import quasiform from '../src/js/quasiform.js';
require('es6-promise/auto');
require('es6-symbol/implement');

function initForms() {
    /**
     * Form does not exists
     */
    var optionsNotExists = {
        selector: '#ne',
        hideFormOnSuccess: false,
    };
    var quasiformNotExists = new quasiform(optionsNotExists);
    
    /**
     * Spinner
     */
    var optionsSpinner = {
        selector: '#spinner',
        hideFormOnSuccess: false,
    };
    var quasiformSpinner = new quasiform(optionsSpinner);
    
    /**
     * Нулевая форма
     */
    var optionsPost = {
        selector: '#post',
        debug: true,
        format: 'html',
        hasErrorInputClass: 'quasiform-form__input--has-error',
        hasErrorLabelClass: 'quasiform-form__label--has-error',
        hideFormOnSuccess: false,
        callbackOnSuccess: function callbackOnSuccess(wrapper) {
            console.log('callbackOnSuccess');
            //console.debug(wrapper);
        },
        callbackOnFail: function callbackOnFail(wrapper) {
            console.log('callbackOnFail');
            //console.debug(wrapper);
        },
        callbackOnError: function callbackOnError(wrapper) {
            console.log('callbackOnError');
            //console.debug(wrapper);
        },
        callbackBeforeSend: function callbackBeforeSend(wrapper) {
            console.log('callbackBeforeSend');
            //console.debug(wrapper);
        },
        callbackOnComplete: function callbackOnComplete(wrapper) {
            console.log('callbackOnComplete');
            //console.debug(wrapper);
        },
    };
    var quasiformPost = new quasiform(optionsPost);

    /**
     * Первая форма
     */
    var optionsSuccess = {
        selector: '#success',
        debug: true,
        hasErrorInputClass: 'quasiform-form__input--has-error',
        hasErrorLabelClass: 'quasiform-form__label--has-error',
        hideFormOnSuccess: false,
        callbackOnSuccess: function callbackOnSuccess(wrapper) {
            console.log('callbackOnSuccess');
            //console.debug(wrapper);
        },
        callbackOnFail: function callbackOnFail(wrapper) {
            console.log('callbackOnFail');
            //console.debug(wrapper);
        },
        callbackOnError: function callbackOnError(wrapper) {
            console.log('callbackOnError');
            //console.debug(wrapper);
        },
        callbackBeforeSend: function callbackBeforeSend(wrapper) {
            console.log('callbackBeforeSend');
            //console.debug(wrapper);
        },
        callbackOnComplete: function callbackOnComplete(wrapper) {
            console.log('callbackOnComplete');
            //console.debug(wrapper);
        },
    };
    var quasiformSuccess = new quasiform(optionsSuccess);

    /**
     * Вторая форма
     */
    var optionsFail = {
        selector: '#fail',
        debug: true,
        hasErrorInputClass: 'quasiform-form__input--has-error',
        hasErrorLabelClass: 'quasiform-form__label--has-error',
        hideFormOnSuccess: false,
        callbackOnSuccess: function callbackOnSuccess(wrapper) {
            console.log('callbackOnSuccess');
            //console.debug(wrapper);
        },
        callbackOnFail: function callbackOnFail(wrapper) {
            console.log('callbackOnFail');
            //console.debug(wrapper);
        },
        callbackOnError: function callbackOnError(wrapper) {
            console.log('callbackOnError');
            //console.debug(wrapper);
        },
        callbackBeforeSend: function callbackBeforeSend(wrapper) {
            console.log('callbackBeforeSend');
            //console.debug(wrapper);
        },
        callbackOnComplete: function callbackOnComplete(wrapper) {
            console.log('callbackOnComplete');
            //console.debug(wrapper);
        },
    };
    var quasiformFail = new quasiform(optionsFail);

    /**
     * Звёзды
     */
    var optionsStars = {
        selector: '#stars',
        debug: true,
        hideFormOnSuccess: false,
        callbackOnStarsChange: function callbackOnStarsChange(wrapper) {
            console.log('callbackOnStarsChange');
        }
    };
    var quasiformStars = new quasiform(optionsStars);

    /**
     * Чекбокс
     */
    var optionsCheckbox = {
        selector: '#checkbox',
        debug: true,
        hideFormOnSuccess: false,
        callbackOnAgree: function callbackOnAgree(wrapper) {
            console.log('agree');
        },
        callbackOnDisagree: function callbackOnDisagree(wrapper) {
            console.log('disagree');
        }
    };
    var quasiformCheckbox = new quasiform(optionsCheckbox);
    
    /**
     * HTML-ответ
     */
    var optionsHtml = {
        selector: '#html',
        debug: true,
        format: 'html',
        hideFormOnSuccess: false,
        callbackOnAgree: function callbackOnAgree(wrapper) {
            console.log('agree');
        },
        callbackOnDisagree: function callbackOnDisagree(wrapper) {
            console.log('disagree');
        }
    };
    var quasiformHtml = new quasiform(optionsHtml);
}

if (document.readyState === 'complete' || document.readyState !== 'loading') {
    initForms();
} else {
    document.addEventListener('DOMContentLoaded', initForms);
}