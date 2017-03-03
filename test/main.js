$(function () {
    /**
     * Первая форма
     */
    let optionsSuccess = {
        debug: true,
        hasErrorInputClass: 'quasiform-form__input--has-error',
        hasErrorLabelClass: 'quasiform-form__label--has-error',
        hideFormOnSuccess: false,
        callbackOnSuccess: function callbackOnSuccess(wrapper) {
            console.debug(wrapper);
        },
        callbackOnFail: function callbackOnFail(wrapper) {
            console.debug(wrapper);
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
            console.debug(wrapper);
        },
        callbackOnFail: function callbackOnFail(wrapper) {
            console.debug(wrapper);
        },
    };
    let quasiformFail = $('#fail').quasiform(optionsFail);
});