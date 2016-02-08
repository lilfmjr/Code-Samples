(function ()
{
	'use strict';
	
	var
		b,
		isExcecutableContext = typeof window ===  'object' && typeof document === 'object';
		
	b =
	{
		checkout:
		{
			onClick: function (event)
			{
				event.preventDefault();
				
				if(typeof _gaq === 'object')
				{
					_gaq.push(['_link', this.href]);
				}
				else
				{
					window.location = this.href;
				}
				
				return false;
			},
			init: function ()
			{
				$('a#checkoutLink').click(b.checkout.onClick);
			}
		},
		patch:
		{
			init: function ()
			{
				b.patch.placeholder();
				//b.patch.imageBlock();
				b.patch.emptyLink();
			},
			blockMethod: function (e)
			{
				e.preventDefault();
				return false;
			},
			imageBlock: function ()
			{
				$('img').bind('contextmenu', b.patch.blockMethod);
				$('img').mousedown(b.patch.blockMethod);
			},
			emptyLink: function ()
			{
				$('a[href=#]').click(b.patch.blockMethod);
			},
			placeholder: function ()
			{
				if (!Modernizr.input.placeholder)
				{
					$('input, textarea').placeholder();
				}
			},
			isIE: function ()
			{
				return navigator.appName === 'Microsoft Internet Explorer';
			},
			isFirefox: function ()
			{
				return navigator.appName === 'Netscape';
			}
		},
		myRegistry:
		{
			init: function ()
			{
				$('a.myRegistryLink').click(b.myRegistry.event.loadStart);
				$('#agotomembersregistry2').click(b.myRegistry.event.completeDialog);
				$('#AddToMrFrame_CloseButton').click(b.myRegistry.event.completeDialog);
			},
			event:
			{
				loadStart: function ()
				{
					$(this).html('Loading, Please Wait...');
					$.getScript(
						'http://www.myregistry.com/addgiftmr/widgetjs.aspx',
						function (data, status, get)
						{
							var result = get.status === 200;
							if (result)
							{
								$('div.myRegistry').css('display', 'block');
								setTimeout(b.myRegistry.event.loadComplete, 1000);
							}
						}
					);
				},
				loadComplete: function ()
				{
					$('a.myRegistryLink').html('Add to Registry');
					$('div.myRegistry').append($('#divAddToMyregistry_Panel_Container').html());
				},
				hide: function ()
				{
					$('div.myRegistry').html('');
					$('div.myRegistry').css('display', 'none');
				},
				completeDialog: function ()
				{
					b.myRegistry.event.hide();
					return true;
				}
			}
		},
		search:
		{
			submit: function ()
			{
				return b.search.validate($(this));
			},
			validate: function (obj)
			{
				var value = obj.find('input[name=search]').val();
				return value.replace(/\s/g, '') !== '';
			},
			init: function ()
			{
				$('form.search').submit(b.search.submit);
			}
		},
		plugins:
		{
			//init: function ()
			//{
			//	b.plugins.facebook();
			//},
			facebook: function ()
			{
				(function (d, s, id)
				{
					var js, fjs = d.getElementsByTagName(s)[0];
					if (!d.getElementById(id))
					{
						js = d.createElement(s); js.id = id;
						js.src = "//connect.facebook.net/en_US/all.js#xfbml=1";
						fjs.parentNode.insertBefore(js, fjs);
					}
				}(document, 'script', 'facebook-jssdk'));
			}
		},
		faq:
		{
			init: function ()
			{
				$('.faq a[href^=#]').click(b.faq.event);
				$('.faq a[href^=#]').first().addClass('focus');
			},
			event: function ()
			{
				b.faq.clear();
				$($(this).attr('href')).slideDown();
				$(this).addClass('focus');
				$('div.inset').stop().animate({ scrollTop: 0 });
				return false;
			},
			clear: function ()
			{
				$('.faq a[href^=#]').removeClass('focus');
				$('.faq div[id]').each(
					function ()
					{
						if ($(this).css('display') === 'block')
						{
							$('.faq div[id]').slideUp();
						}
					}
				);

			}
		},
		slide:
		{
			options:
			{
				/* In Seconds */
				timeout: 8,
				fadeTime: 2
			},
			events:
			{
				tick: function (direction)
				{
					b.slide.index().css('position', 'absolute');
					b.slide.current = direction ? b.slide.getPrevious() : b.slide.getNext();

					var
						current = $(b.slide.index().get(b.slide.current)),
						previous = $(b.slide.index().get(direction ? b.slide.getNext() : b.slide.getPrevious())),
						fadeTime = b.slide.options.fadeTime * 1000;

					b.slide.resetHeight();
					current.fadeIn(fadeTime);
					previous.fadeOut(fadeTime);
				},
				pause: function ()
				{
					clearInterval(b.slide.timeHandler);
					b.slide.timeHandler = null;
				},
				play: function ()
				{
					b.slide.startTick();
				},
				resolutionChange:
				{
					bubble: function ()
					{
						b.slide.resetHeight();
					}
				},
				next: function ()
				{
					b.slide.events.pause();
					b.slide.events.tick();
				},
				previous: function ()
				{
					b.slide.events.pause();
					b.slide.events.tick(true);
				}
			},
			resetHeight: function ()
			{
				var current = $(b.slide.index().get(b.slide.current));
				$('body div.slideshow').height(current.height() + 'px');
			},
			timeHandler: null,
			current: 0,
			getNext: function ()
			{
				var
					last = b.slide.count(),
					current = b.slide.current + 1;

				return current >= last ? 0 : current;
			},
			getPrevious: function ()
			{
				var previous = b.slide.current - 1;
				return previous < 0 ? b.slide.count() - 1 : previous;
			},
			index: function ()
			{
				return $('body div.slideshow div');
			},
			count: function ()
			{
				return b.slide.index().size();
			},
			startTick: function ()
			{
				if (!b.slide.timeHandler)
				{
					b.slide.index().first().css({ display: 'block', opacity: 1 });
					b.slide.timeHandler = setInterval(b.slide.events.tick, b.slide.options.timeout * 1000);
				}
			},
			show: function ()
			{
				if (b.slide.index())
				{
					//b.slide.resetHeight();
					b.slide.startTick();
					b.slide.index().hover(b.slide.events.pause, b.slide.events.play); //Pause on hover

					$('div.slideshow a.previous, div.slideshow a.next').hover(b.slide.events.pause);
					
					$('div.slideshow a.previous').click(b.slide.events.previous);
					$('div.slideshow a.next').click(b.slide.events.next);
				}
			}
		},
		video:
		{
			lastScroll: null,
			originalText: null,
			init: function ()
			{
				$('a[data-video="true"]').click(b.video.event.show);
				$('a[data-video="false"]').click(b.video.event.hide);
				$('div.screen').click(b.video.event.hide);
			},
			api: function (instance)
			{
				var
					f = instance,
					onFinish,
					onPause = function () { return; },
					onPlayProgress = function (data) { return; },
					onMessageReceived,
					onReady,
					post,
					url = f.attr('src').split('?')[0];

				onReady = function ()
				{
					b.video.originalText = $('div.screen a').html();
					$('div.screen a').html('Close Video');
					post('addEventListener', 'pause');
					post('addEventListener', 'finish');
					post('addEventListener', 'playProgress');
				};

				onFinish = function ()
				{
					$('div.screen a').html('And Scene. Please wait...');
					setTimeout(b.video.event.hide, 1000);
				};

				// Handle messages received from the player
				onMessageReceived = function(e)
				{
					var data = JSON.parse(e.data);

					switch (data.event)
					{
						case 'ready':
							onReady();
							break;

						case 'playProgress':
							onPlayProgress(data.data);
							break;

						case 'pause':
							onPause();
							break;

						case 'finish':
							onFinish();
							break;
					}
				};
				
				// Listen for messages from the player
				if (window.addEventListener)
				{
					window.addEventListener('message', onMessageReceived, false);
				}
				else
				{
					window.attachEvent('onmessage', onMessageReceived, false);
				}

				// Helper function for sending a message to the player
				post = function(action, value)
				{
					var data = { method: action };

					if (value)
					{
						data.value = value;
					}

					f[0].contentWindow.postMessage(JSON.stringify(data), url);
				};
				
				// Call the API when a button is pressed
				$('button').on('click', function ()
				{
					post($(this).text().toLowerCase());
				});
			},
			event:
			{
				show: function ()
				{
					var
						link = $(this).attr('href') + "?api=1&byline=0&portrait=0&color=AFBD1F&autoplay=true",
						left = Math.round($('div.banner div').offset().left) + 'px',
						//top = Math.round($('div.banner div').offset().top) + 'px',
						width = Math.round($('div.banner div').width()) + 'px',
						height = Math.round($('div.banner div').height()) + 'px',
						instance = $('div.screen iframe'),
						pointer = b.patch.isIE() ? $('html') : $('body'),
						fadeIn = function ()
						{
							$('div.screen div.video').css('display', 'block');
							$('div.screen').fadeIn();
							instance.attr('src', link);
							//instance.css({ top: top, left: left, width: width, height: height });
							instance.css({ top: 0, left: left === "0px" ? !b.patch.isFirefox() ? "220px" : "200px" : left, width: width, height: height });
							b.video.api(instance);
						};

					b.video.lastScroll = pointer.scrollTop();
					if (!b.patch.isFirefox())
					{
						pointer.css('overflow', 'hidden');
					}
					
					pointer.stop().animate(
						{ scrollTop: 0 },
						fadeIn
					);

					return false;
				},
				hide: function ()
				{
					var
						pointer = b.patch.isIE() ? $('html') : $('body'),
						fadeOut = function ()
						{
							pointer.css('overflow', 'auto');
							$('div.screen a').html(b.video.originalText);
							$('div.screen div.video').css('display', 'none');
						};

					b.announce.close();
					
					$('div.screen iframe').attr('src', '');
					$('div.screen').fadeOut(
						function ()
						{
							if (b.video.lastScroll)
							{
								pointer.stop().animate(
									{ scrollTop: b.video.lastScroll },
									fadeOut
								);
							}
							
							$('div.screen div.registry').html('');
							b.video.lastScroll = null;
						}
					);
					return false;
				}
			}
		},
		announce:
		{
			setCookie: function (value)
			{
				$.cookie('visited', value, { expires: 365 });

				return b.announce.isCookie();
			},
			isCookie: function ()
			{
				return !!$.cookie('visited');
			},
			ment: function ()
			{
				$('div.screen').css('display', 'block');
				$('div.announcement').css('display', 'block');
				$('div.announcement a.close').click(b.announce.close);
				$('div.announcement a.submit').click(b.announce.submit);
			},
			submit: function ()
			{
				$('div.announcement form').submit();
			},
			close: function (event)
			{
				if (event)
				{
					event.preventDefault();
				}

				$('div.screen').css('display', 'none');
				$('div.announcement').css('display', 'none');

				return false;
			},
			init: function ()
			{
				if (!b.announce.isCookie() && b.announce.setCookie(true))
				{
					b.announce.ment();
				}
			}
		},
		eatriz: function ()
		{
			b.search.init();
			b.patch.init();
			b.slide.show();
			//b.plugins.init();
			b.video.init();
			b.faq.init();
			b.myRegistry.init();
			b.patch.init();
			b.announce.init();
			b.checkout.init();
		}
	};
	
	if(isExcecutableContext)
	{
		window.b = b;
		$(window.b.eatriz);
	}
}());