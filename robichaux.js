/**
* Beta Digicomm Javascript Library
*
* @author Floyd Miles
* @version 0.1a
*/
var dlib = function (Target, Namespace, ready) {
	this.ready = ready;
	this.target = window[Target] == null ? 'digi' : target;
	/**
	* Prototype Definitions for String Helper Tools
	*/
	var string =
	{
		/**
		* Replaces tokens in a string.
		* ( Visual C# equivalent to String.Format )
		*
		* @param {string} Input String
		* @param {csv:string} Tokens to be replaced
		*/
		format:
		{
			base: function () {
				var txt = this;
				for (a = 0; a < arguments.length; a++) {
					txt = txt.replace(RegExp('\\{' + (a) + '\\}', 'gi'), arguments[a]);
				}
				return txt;
			},
			inline: function (text) {
				var txt = text;
				for (a = 1; a < arguments.length; a++) {
					txt = txt.replace(RegExp('\\{' + (a - 1) + '\\}', 'gi'), arguments[a]);
				}
				return txt;
			}
		},

		/**
		* Check to see if a character sequence exists in a string 
		* ( Case Sensitive )
		*
		* @return Boolean
		* @param {string} Input String
		* @param {contains} Tokens to be replaced
		*/
		contains:
		{
			base: function (contains) {
				return this.toString().indexOf(contains) > -1;
			},
			inline: function (text, contains) {
				return text.toString().indexOf(contains) > -1;
			}
		},

		/**
		* Constructor for String Class Prototype
		* 
		* @constructor
		*/
		init: function () {
			window.string = {};
			for (var i in string) {
				if (i != 'init') {
					String.prototype[i] = string[i].base;
					window.string[i] = string[i].inline;
				}
			}
		}
	}
	string.init();

	/**
	* Base library definition for dlib Library
	*/
	this.jQueryExists = typeof ($) == 'undefined' ? typeof (jQuery) == 'undefined' ? false : true : true;

	this.lib = function () {
		var _ =
		{
			form:
			{
				init: function () {
					$('input[name*=Phone]').mask("(999) 999-9999");
					$('#FormContact').submit(_.form.submit);
					$('#FormContact .submit').click
					(
						function () {
							$('#FormContact').submit();
							return false;
						}
					);
				},
				failure: function (data) {
					//$('div.form p.failure').css('display', 'block');
					//_.form.thanks();
					//window.location = '/resources/services/error.ashx?Message="{0}"&Redirect="{1}"'.format(data, '/failure');
				},
				google: function ()
				{
					$.get('/js/google.js');
					$.getScript('http://www.googleadservices.com/pagead/conversion.js');
				},
				reset: function () {
					$(':input', '#FormContact')
						.not(':button, :submit, :reset, :hidden')
						.val('')
						.removeAttr('checked')
						.removeAttr('selected');
				},
				submit: function () {
					if ($('#FormContact').validationEngine('validate'))
					{
						$('div.form a.submit').html('Please Wait...');
						$.ajax
						({
							type: 'POST',
							url: '/resources/services/contact.ashx',
							data: $("#FormContact").serialize(),
							success: function (data) {
								$('html,body').animate({ scrollTop: $('div.column-right').offset().top }, 'slow');
								if (data == 'True') {
									_.form.google();
									_.form.success();
									_.form.reset();
								}
								else {
									_.form.failure(data);
								}
							}
						});
						$('#FormContact .submit').click
						(
							function ()
							{
								return false;
							}
						);
					}
					return false;
				},
				success: function () {
					//$('div.form p.success').css('display', 'block');
					//_.form.thanks();
					window.location = "/success";
				},
				thanks: function () {
					$('div.form div.thanks').css('display', 'block');
					$('div.form div.thanks').animate({ opacity: 1 }, 750);
					$('#FormContact').animate({ opacity: 0, height: "0px" }, 1000, function () { $(this).css('display', 'none'); });
				}
			},
			parent: this,
			ready: function () {
				if (_.parent.ready)
					_.parent.ready();
			},
			init:
			{
				error:
				{
					message: "A site error has occured. We're sorry for the inconvience.",
					jQuery:
					{
						value: false,
						message: 'A function attempted to run but requires a jQuery Library instance which is not defined.'
					},
					undef: function (exc, arg) {
						exc = ("" + exc).toLowerCase().replace(/'/gi, '');
						return exc.contains('{0} is not defined'.format(arg)) ||
								exc.contains('{0} is undefined'.format(arg)) ||
								exc.contains('undefined variable: {0}'.format(arg));
					}
				},
				list:
				[
					function () { _.form.init() }
				],
				fn: function () {
					var list = _.init.list;
					for (var i in list) {
						try {
							list[i]();
						}
						catch (ex) {
							var pex = ("" + ex).toLowerCase().replace(/'/gi, '');
							var message = _.init.error.message + '\n\nError Detais: "{0}"';
							var exp = _.init.error.undef(ex, '$') || _.init.error.undef(ex, 'jQuery');
							if (exp) {
								message = message.format();
								if (!_.init.error.jQuery.value) {
									alert(message.format(_.init.error.jQuery.message));
									_.init.error.jQuery.value = true;
								}
							}
							else {
								alert(message.format(ex));
							}
						}
					}
					return _;
				}
			}
		}
		return _.init.fn();
	}
	this.obj = {};
	var base = this;
	var init = function () {
		var ns = Namespace == null ? 'comm' : Namespace;
		base.obj[ns] = base.lib();
		window[base.target] = base.obj;
		base.obj[ns].ready();
		return base.obj;
	}
	if (this.jQueryExists) {
		$(document).ready(init);
	}
	else
		return init();
}
dlib();