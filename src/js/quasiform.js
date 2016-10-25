function recaptchaCallBack() {
    var recaptches = $('[data-object="quasiform-recaptcha"][data-sitekey][id]');
    $.each(recaptches, function(index, recaptcha) {
        console.debug($(recaptcha));
        var recaptchaOptions = {};
        var sitekey = $(recaptcha).attr('data-sitekey');
        if (sitekey != undefined) {
            recaptchaOptions.sitekey = $(recaptcha).attr('data-sitekey');
        }
        grecaptcha.render($(recaptcha).attr('id'), recaptchaOptions);
    });
}
$(function() {
    console.log('quasiform.js');
    var checkboxAgreeSelector = 'input[data-quasiform="checkbox-agree"]';

    function renderAgreeCheckboxes(selector) {
        var checkboxes = $(selector);
        $.each(checkboxes, function(index, checkbox) {
            var checked = $(checkbox).is(':checked');
            var form = $(checkbox).closest('form');
            if (typeof form == 'object') {
                if (checked) {
                    $(form).find('button[type="submit"]').removeAttr('disabled');
                } else {
                    $(form).find('button[type="submit"]').attr('disabled', true);
                }
            }
        });
    }
    renderAgreeCheckboxes(checkboxAgreeSelector);
    $(document).on('change', checkboxAgreeSelector, function(e) {
        renderAgreeCheckboxes(checkboxAgreeSelector);
    });
    $(document).on('submit', 'form[data-quasiform="form"]', function(e) {
        var form = $(this);
        $(form).find('button[type="submit"]').attr('disabled', '');
        var messagesWrapperSelector = '[data-quasiform="messages"]';
        var errorsWrapperSelector = '[data-quasiform="errors"]';
        var formData = new FormData($(form)[0]);
        var formAction = $(form).attr('action');
        var formType = $(form).attr('method');
        $.ajax({
            contentType: false,
            processData: false,
            data: formData,
            dataType: 'json',
            type: formType,
            url: formAction,
            complete: function() {
                form.find('button[type="submit"]').removeAttr('disabled');
            },
            error: function(xhr, ajaxOptions, thrownError) {
                if (xhr.status == 404) {
                    console.log('Ошибка 404');
                } else if (xhr.status == 500) {
                    console.log('Ошибка 500');
                } else {
                    console.log('Ошибка ' + xhr.status);
                }
            },
            success: function(data, textStatus) {
                if (typeof data == 'object') {
                    errorsList = '';
                    messagesList = '';
                    $(form).parent().find(errorsWrapperSelector).hide();
                    $(form).parent().find(messagesWrapperSelector).hide();
                    $(form).find('.form-group').removeClass('has-error');
                    if (data.errors.length > 0) {
                        for (i = 0; i < data.errors.length; i++) {
                            errorsList += '<li>' + data.errors[i] + '</li>';
                        }
                        errorsList = '<ul>' + errorsList + '</ul>';
                    } else {
                        errorsList = data.message;
                    }
                    if (data.messages.length > 0) {
                        for (i = 0; i < data.messages.length; i++) {
                            messagesList += '<li>' + data.messages[i] + '</li>';
                        }
                        messagesList = '<ul>' + messagesList + '</ul>';
                    } else {
                        messagesList = data.message;
                    }
                    if (data.success) {
                        $(form).parent().find(messagesWrapperSelector).html(messagesList).fadeIn('fast');
                        $(form).fadeOut('fast').remove();
                    } else {
                        $(form).parent().find(errorsWrapperSelector).html(errorsList).fadeIn('fast');
                        for (var fieldName in data.field_errors) {
                            var fieldErrorsList = '';
                            var fieldErorrs = data.field_errors[fieldName];
                            for (i = 0; i < fieldErorrs.length; i++) {
                                fieldErrorsList += '<p>' + fieldErorrs[i] + '</p>';
                            }
                        }
                        $(form).find('button').removeAttr('disabled');
                    }
                    $('.form-group').each(function() {
                        if (!$(this).hasClass('has-error')) {
                            $(this).addClass('has-success');
                        }
                    });
                } else {
                    console.log('Ответ сервера имеет неверный формат');
                }
            }
        });
        e.preventDefault();
    });
});