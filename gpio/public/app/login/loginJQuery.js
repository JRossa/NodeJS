/*jslint node: true */
/*jslint browser: true*/
/*jslint jquery: true*/
/*global angular: false */
/*global menuDropDown: false */
/*global moment: false */
/*jshint strict:false */
'use strict';

window.onload = setLoadLogin;


function setLoadLogin () {
	loadLogin();
	loadListener();

	menuDropDown();
}

// http://developer.telerik.com/featured/building-html5-form-validation-bubble-replacements/
function listenLoginUser () {

	var input = document.getElementById('user-tf');
	var label = angular.element('#langSelected').scope().label;

	input.addEventListener('invalid', function(e) {
			if(input.validity.valueMissing){
				console.log(label);
				if (typeof label !== 'undefined') {
					e.target.setCustomValidity(label.tblData_infoFiltered);
				}
			} else if(!input.validity.valid) {
					e.target.setCustomValidity("This is not a valid username");
			}
			// to avoid the 'sticky' invlaid problem when resuming typing after getting a custom invalid message
			input.addEventListener('input', function(e){
					e.target.setCustomValidity('');
			});
	}, false);
}

$('#selectLang').change( function() {
	listenLoginUser();
});

function loadListener() {
	setTimeout(function(){

		listenLoginUser();
	}, 200);
}

function testSubmit() {
	console.log('submit');

}

function loadLogin () {
	var lc = new LoginController();

// main login form //


// login retrieval form via email //

	var ev = new EmailValidator();

	$('#get-credentials-form').ajaxForm({
		url: '/lost-password',
		beforeSubmit : function(formData, jqForm, options){
			if (ev.validateEmail($('#email-tf').val())){
				ev.hideEmailAlert();
				return true;
			}	else{
				ev.showEmailAlert("<b>Error!</b> Please enter a valid email address");
				return false;
			}
		},
		success	: function(responseText, status, xhr, $form){
			$('#cancel').html('OK');
			$('#retrieve-password-submit').hide();
			ev.showEmailSuccess("Check your email on how to reset your password.");
		},
		error : function(e){
			if (e.responseText == 'email-not-found'){
				ev.showEmailAlert("Email not found. Are you sure you entered it correctly?");
			}	else{
				$('#cancel').html('OK');
				$('#retrieve-password-submit').hide();
				ev.showEmailAlert("Sorry. There was a problem, please try again later.");
			}
		}
	});

}
