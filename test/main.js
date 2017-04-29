$(function () {
    /**
     * Нулевая форма
     */
    let optionsPost = {
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
    let quasiformStars = $('#stars').quasiform(optionsStars);
});