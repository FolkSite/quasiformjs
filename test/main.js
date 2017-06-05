function initForms() {
	/**
	 * Form does not exists
	 */
	let optionsNotExists = {
	    hideFormOnSuccess: false,
	};
	let quasiformNotExists = $('#ne').quasiform(optionsNotExists);
	
	/**
	 * Spinner
	 */
	let optionsSpinner = {
	    hideFormOnSuccess: false,
	};
	let quasiformSpinner = $('#spinner').quasiform(optionsSpinner);
	
    /**
     * Нулевая форма
     */
    let optionsPost = {
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
    let quasiformPost = $('#post').quasiform(optionsPost);

    /**
     * Первая форма
     */
    let optionsSuccess = {
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
    let quasiformSuccess = $('#success').quasiform(optionsSuccess);

    /**
     * Вторая форма
     */
    let optionsFail = {
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
    let quasiformFail = $('#fail').quasiform(optionsFail);

    /**
     * Звёзды
     */
    let optionsStars = {
        debug: true,
        hideFormOnSuccess: false,
        callbackOnStarsChange: function callbackOnStarsChange(wrapper) {
            console.log('callbackOnStarsChange');
        }
    };
    let quasiformStars = $('#stars').quasiform(optionsStars);

    /**
     * Чекбокс
     */
    let optionsCheckbox = {
        debug: true,
        hideFormOnSuccess: false,
        callbackOnAgree: function callbackOnAgree(wrapper) {
            console.log('agree');
        },
        callbackOnDisagree: function callbackOnDisagree(wrapper) {
            console.log('disagree');
        }
    };
    let quasiformCheckbox = $('#checkbox').quasiform(optionsCheckbox);
    
    /**
     * HTML-ответ
     */
    let optionsHtml = {
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
    let quasiformHtml = $('#html').quasiform(optionsHtml);
}

if (document.readyState === 'complete' || document.readyState !== 'loading') {
  initForms();
} else {
  document.addEventListener('DOMContentLoaded', initForms);
}