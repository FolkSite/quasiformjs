# quasiformjs
This is jQuery plugin that helps submiting and validating your forms asynchronously. Keep your validation logic on server side, and for client side validate with javascript and AJAX.<br />
Supports multiple reCaptcha 3.
## Demo ##
[https://quasi-art.ru/contacts](https://quasi-art.ru/contacts)
## Requirements ##
Requires jQuery 3.1+.
## Options ##
### debug ###
Default: false
### errorOpenTag ###
Defaut: `<li>`
### errorCloseTag ###
Defaut: `</li>`
### errorsOpenTag ###
Defaut: `<ul>`
### errorsCloseTag ###
Defaut: `</ul>`
### messageOpenTag ###
Defaut: `<li>`
### messageCloseTag ###
Defaut: `</li>`
### messagesOpenTag ###
Defaut: `<ul>`
### messagesCloseTag ###
Defaut: `</ul>`
### hideFormOnSuccess ###
Boolean flag indicating whether the form should be hide if the submit is successful<br />
Defaut: `false`
### hasErrorInputClass ###
Defaut: `quasiform-form__input--has-error`
### hasErrorLabelClass ###
Defaut: `quasiform-form__input--has-error`
### callbackOnSuccess ###
Callback function to be invoked after the form has been submitted. If a success callback function is provided it is invoked after the response has been returned from the server.
### callbackOnFail ###
Callback function to be invoked upon error.
## File Uploads ##
The Form Plugin supports use of XMLHttpRequest Level 2 and FormData objects on browsers that support these features.
## Example ##
### JavaScript ###
	$(function () {
	    let optionsPost = {
	        debug: true,
	        hasErrorInputClass: 'has-error',
	        hasErrorLabelClass: 'has-error',
	        hideFormOnSuccess: false,
	        callbackOnSuccess: function callbackOnSuccess(wrapper) {
	            console.debug(wrapper);
	        },
	        callbackOnFail: function callbackOnFail(wrapper) {
	            console.debug(wrapper);
	        },
	    };
	    let quasiformPost = $('#post').quasiform(optionsPost);
	});
### HTML ###
	<div id="post" class="quasiform-wrapper">
		<div data-quasiform="errors" style="display: none;"></div>
		<div data-quasiform="messages" style="display: none;"></div>
		<div data-quasiform="loader" style="display: none;">
			Я отправляю форму
		</div>
		<form action="post.php" method="post" accept-charset="utf-8" class="quasiform-form" enctype="multipart/form-data">
			<div class="row">
				<div class="col s12">
					<div class="quasiform-form__form-group">
						<label for="text" class="quasiform-form__label">Сообщение</label>
						<textarea id="text" name="text" placeholder="Ваше сообщение" class="quasiform-form__textarea">Hello</textarea>
					</div>
				</div>
			</div>
			<div class="quasiform-form__form-group">
				<button type="submit" class="quasiform-form__submit">Отправить</button>
			</div>
		</form>
	</div>
