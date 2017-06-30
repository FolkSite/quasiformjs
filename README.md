# quasiformjs
This is jQuery plugin that helps submiting and validating your forms asynchronously. Keep your validation logic on server side, and for client side validate with javascript and AJAX.
Supports multiple reCaptcha 3.
## Demo ##
[https://quasi-art.ru/contacts](https://quasi-art.ru/contacts)
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
### hasErrorInputClass ###
Defaut: `quasiform__form-input--has-error`
### hasErrorLabelClass ###
Defaut: `quasiform__form-label--has-error`
### callbackOnSuccess ###
Callback function to be invoked after the form has been submitted. If a success callback function is provided it is invoked after the response has been returned from the server.
### callbackOnFail ###
Callback function to be invoked upon error.
## File Uploads ##
The Form Plugin supports use of XMLHttpRequest Level 2 and FormData objects on browsers that support these features.
## Screenshots ##
### Custom checkbox ###
![Report, part 1](https://raw.githubusercontent.com/mishantrop/quasiformjs/master/test/screenshots/checkbox.png "Custom checkbox")
### Loader ###
![Loader](https://raw.githubusercontent.com/mishantrop/quasiformjs/master/test/screenshots/loader.png "Loader")
### Error messages ###
![Error messages](https://raw.githubusercontent.com/mishantrop/quasiformjs/master/test/screenshots/fail.png "Error messages")
### Star rating ###
![Star rating](https://raw.githubusercontent.com/mishantrop/quasiformjs/master/test/screenshots/stars.png "Star rating")
### Success response ###
![Success response](https://raw.githubusercontent.com/mishantrop/quasiformjs/master/test/screenshots/success.png "Success response")
## Initialization ##
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
		<div data-quasiform="errors" style="display: none;" class="quasiform__errors"></div>
		<div data-quasiform="messages" style="display: none;" class="quasiform__messages"></div>
		<div data-quasiform="loader" style="display: none;" class="quasiform__loader">
			Я отправляю форму
		</div>
		<form action="post.php" method="post" accept-charset="utf-8" class="quasiform__form" enctype="multipart/form-data">
			<div class="quasiform__form__form-group">
				<label for="text" class="quasiform__form-label">Сообщение</label>
				<textarea id="text" name="text" placeholder="Ваше сообщение" class="quasiform__form-textarea">Hello</textarea>
			</div>
			<div class="quasiform__form__form-group">
				<button type="submit" class="quasiform__form-submit">Отправить</button>
			</div>
		</form>
	</div>
### Server response ###
	{
		"errors": ["Error 1", "Error 2"],
		"messages": ["Message 1", "Message 2"],
		"success": true
	}
## Roadmap ##
* webpack conf
* http://jsonapi.org/
* Custom validation
* Client validation
* Rendering response result to separate method
* ES6
* Demo of multiple recaptcha
* Detect offline
* Check if response is not json
* Customization of Spinner
* Customization of Star Rating
* Customization of File Input
* Positive UX (optional; show success before response complete)