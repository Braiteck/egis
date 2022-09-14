$(() => {
	// Ширина окна для ресайза
	WW = $(window).width()


	// Слайдер мнений врачей
	const opinionsBigSliders = []

	$('.expert_opinion .swiper.big').each(function (i) {
		$(this).addClass('opinions_big_s' + i)

		let options = {
			loop: true,
			speed: 500,
			watchSlidesProgress: true,
			slideActiveClass: 'active',
			slideVisibleClass: 'visible',
			navigation: {
				nextEl: '.swiper-button-next',
				prevEl: '.swiper-button-prev'
			},
			preloadImages: false,
			lazy: {
				enabled: true,
				checkInView: true,
				loadOnTransitionStart: true,
				loadPrevNext: true
			},
			spaceBetween: 24,
			slidesPerView: 1,
			autoHeight: true
		}

		opinionsBigSliders.push(new Swiper('.opinions_big_s' + i, options))
	})


	// Карусель мнений врачей
	const opinionsSliders = []

	$('.expert_opinion .swiper.carousel').each(function (i) {
		$(this).addClass('opinions_s' + i)

		let options = {
			loop: true,
			speed: 500,
			watchSlidesProgress: true,
			slideActiveClass: 'active',
			slideVisibleClass: 'visible',
			navigation: {
				nextEl: '.swiper-button-next',
				prevEl: '.swiper-button-prev'
			},
			pagination: {
				el: '.swiper-pagination',
				type: 'bullets',
				clickable: true,
				bulletActiveClass: 'active'
			},
			preloadImages: false,
			lazy: {
				enabled: true,
				checkInView: true,
				loadOnTransitionStart: true,
				loadPrevNext: true
			},
			breakpoints: {
				0: {
					spaceBetween: 24,
					slidesPerView: 'auto'
				},
				1024: {
					spaceBetween: 24,
					slidesPerView: 3
				},
				1280: {
					spaceBetween: 30,
					slidesPerView: 3
				}
			},
			on: {
				init: swiper => {
					setTimeout(() => {
						expertOpinionHeight($(swiper.$el), $(swiper.$el).find('.item').length)
					})
				},
				resize: swiper => {
					setTimeout(() => {
						expertOpinionHeight($(swiper.$el), $(swiper.$el).find('.item').length)
					})
				}
			}
		}

		opinionsSliders.push(new Swiper('.opinions_s' + i, options))
	})


	// Симптомы
	$('.symptoms .spoler_btn').click(function (e) {
		e.preventDefault()

		$(this).toggleClass('active')
		$('.symptoms .item.hide').toggleClass('show')
	})


	// Тест
	let currentStep = 1,
		totalQuestions = $('.test .step').length

	$('.test .progress .bar div').width(currentStep / totalQuestions * 100 + '%')

	$('.test .btns .next_btn').click(function (e) {
		e.preventDefault()

		let parent = $(this).closest('.step')

		parent.hide().next().fadeIn(300)

		currentStep++
		$('.test .progress .count .current').text(currentStep)
		$('.test .progress .bar div').width(currentStep / totalQuestions * 100 + '%')
	})

	$('.test .btns .prev_btn').click(function (e) {
		e.preventDefault()

		let parent = $(this).closest('.step')

		parent.hide().prev().fadeIn(300)

		currentStep = currentStep - 1
		$('.test .progress .count .current').text(currentStep)
		$('.test .progress .bar div').width(currentStep / totalQuestions * 100 + '%')
	})


	// Кнопка 'Вверх'
	$('.buttonUp button').click((e) => {
		e.preventDefault()

		$('body, html').stop(false, false).animate({ scrollTop: 0 }, 1000)
	})


	// Fancybox
	Fancybox.defaults.autoFocus = false
	Fancybox.defaults.trapFocus = false
	Fancybox.defaults.dragToClose = false
	Fancybox.defaults.placeFocusBack = false
	Fancybox.defaults.l10n = {
		CLOSE: "Закрыть",
		NEXT: "Следующий",
		PREV: "Предыдущий",
		MODAL: "Вы можете закрыть это модальное окно нажав клавишу ESC"
	}


	// Моб. меню
	$('header .menu_btn, header .menu .close_btn').click((e) => {
		e.preventDefault()

		$('.mob_header .mob_menu_btn').toggleClass('active')
		$('body').toggleClass('menu_open')
		$('header .menu').toggleClass('show')

		$('.mob_header .mob_menu_btn').hasClass('active')
			? $('.overlay').fadeIn(300)
			: $('.overlay').fadeOut(200)
	})


	// Плавная прокрутка к якорю
	const scrollBtns = document.querySelectorAll('.scroll_btn')

	if (scrollBtns) {
		scrollBtns.forEach(element => {
			element.addEventListener('click', e => {
				e.preventDefault()

				let anchor = element.getAttribute('data-anchor')

				document.getElementById(anchor).scrollIntoView({
					behavior: 'smooth',
					block: 'start'
				}, 1000)
			})
		})
	}


	// Аккордион
	$('body').on('click', '.accordion .accordion_item .head', function(e) {
		e.preventDefault()

		const $item      = $(this).closest('.accordion_item'),
				$accordion = $(this).closest('.accordion')

		if ($item.hasClass('active')) {
			$item.removeClass('active').find('.data').slideUp(300)
		} else {
			$accordion.find('.accordion_item').removeClass('active')
			$accordion.find('.data').slideUp(300)

			$item.addClass('active').find('.data').slideDown(300)
		}
	})


	if (is_touch_device()) {
		// Подменю на тач скрине
		$('header .menu_item > a.sub_link').addClass('touch_link')

		$('header .menu_item > a.sub_link').click(function (e) {
			const $dropdown = $(this).next()

			if ($dropdown.css('visibility') === 'hidden') {
				e.preventDefault()

				$('header .menu .sub_menu').removeClass('show')
				$dropdown.addClass('show')

				$('body').css('cursor', 'pointer')
			}
		})

		// Закрываем под. меню при клике за её пределами
		$(document).click((e) => {
			if ($(e.target).closest('.menu').length === 0) {
				$('header .menu .sub_menu').removeClass('show')

				$('body').css('cursor', 'default')
			}
		})


		// Закрытие моб. меню свайпом справо на лево
		let ts

		$('body').on('touchstart', (e) => { ts = e.originalEvent.touches[0].clientX })

		$('body').on('touchend', (e) => {
			let te = e.originalEvent.changedTouches[0].clientX

			if ($('body').hasClass('menu_open') && ts > te + 50) {
				// Свайп справо на лево
			} else if (ts < te - 50) {
				// Свайп слева на право
				if ($('body').hasClass('menu_open')) {
					$('.mob_header .mob_menu_btn').toggleClass('active')
					$('body').toggleClass('menu_open')
					$('header .menu').toggleClass('show')

					$('.mob_header .mob_menu_btn').hasClass('active')
						? $('.overlay').fadeIn(300)
						: $('.overlay').fadeOut(200)
				}
			}
		})
	}
})



$(window).on('load', () => {
	// Фикс. шапка
	headerInit = true,
		headerHeight = $('header').outerHeight()

	$('header').wrap('<div class="header_wrap"></div>')
	$('.header_wrap').height(headerHeight)

	headerInit && $(window).scrollTop() > 0
		? $('header').addClass('fixed')
		: $('header').removeClass('fixed')


	// Интерпретация результатов
	initResultsSliders()

	// Статьи
	initArticlesSliders()

	// Как дефицит железа влияет на жизнь
	initInfluenceSliders()

	// Выравнивание элементов в сетке
	$('.expert_opinion .row').each(function () {
		expertOpinionHeight($(this), parseInt($(this).css('--expert_opinion_count')))
	})
})



$(window).on('resize', () => {
	if (typeof WW !== 'undefined' && WW != $(window).width()) {
		// Фикс. шапка
		headerInit = false
		$('.header_wrap').height('auto')

		setTimeout(() => {
			headerInit = true
			headerHeight = $('header').outerHeight()

			$('.header_wrap').height(headerHeight)

			headerInit && $(window).scrollTop() > 0
				? $('header').addClass('fixed')
				: $('header').removeClass('fixed')
		}, 100)


		// Перезапись ширины окна
		WW = $(window).width()

		// Интерпретация результатов
		initResultsSliders()

		// Статьи
		initArticlesSliders()

		// Как дефицит железа влияет на жизнь
		initInfluenceSliders()

		// Выравнивание элементов в сетке
		$('.expert_opinion .row').each(function () {
			expertOpinionHeight($(this), parseInt($(this).css('--expert_opinion_count')))
		})
	}
})



$(window).on('scroll', () => {
	// Кнопка 'Вверх'
	$(window).scrollTop() > $(window).innerHeight()
		? $('.buttonUp').fadeIn(300)
		: $('.buttonUp').fadeOut(200)


	// Фикс. шапка
	typeof headerInit !== 'undefined' && headerInit && $(window).scrollTop() > 0
		? $('header').addClass('fixed')
		: $('header').removeClass('fixed')
})



// Интерпретация результатов
resultsSliders = []

function initResultsSliders() {
	if (window.outerWidth < 1024 && window.outerWidth > 539) {
		if ($('.results .row').length) {
			$('.results .row > *').addClass('swiper-slide')
			$('.results .row').addClass('swiper-wrapper').removeClass('row')

			$('.results .swiper').each(function (i) {
				$(this).addClass('results_s' + i)

				let options = {
					loop: false,
					speed: 500,
					watchSlidesProgress: true,
					slideActiveClass: 'active',
					slideVisibleClass: 'visible',
					slidesPerView: 'auto',
					navigation: {
						nextEl: '.swiper-button-next',
						prevEl: '.swiper-button-prev'
					},
					breakpoints: {
						0: {
							spaceBetween: 30
						},
						1024: {
							spaceBetween: 40
						}
					}
				}

				resultsSliders.push(new Swiper('.results_s' + i, options))
			})
		}
	} else {
		resultsSliders.forEach(element => element.destroy(true, true))

		resultsSliders = []

		$('.results .swiper-wrapper').addClass('row').removeClass('swiper-wrapper')
		$('.results .row > *').removeClass('swiper-slide')
	}
}



// Статьи
articlesSliders = []

function initArticlesSliders() {
	if (window.outerWidth > 539) {
		if ($('.articles .row').length) {
			$('.articles .row > *').addClass('swiper-slide')
			$('.articles .row').addClass('swiper-wrapper').removeClass('row')

			$('.articles .swiper').each(function (i) {
				$(this).addClass('articles_s' + i)

				let options = {
					loop: false,
					speed: 500,
					watchSlidesProgress: true,
					slideActiveClass: 'active',
					slideVisibleClass: 'visible',
					slidesPerView: 'auto',
					navigation: {
						nextEl: '.swiper-button-next',
						prevEl: '.swiper-button-prev'
					},
					breakpoints: {
						0: {
							spaceBetween: 30
						},
						1024: {
							spaceBetween: 40
						}
					}
				}

				articlesSliders.push(new Swiper('.articles_s' + i, options))
			})
		}
	} else {
		articlesSliders.forEach(element => element.destroy(true, true))

		articlesSliders = []

		$('.articles .swiper-wrapper').addClass('row').removeClass('swiper-wrapper')
		$('.articles .row > *').removeClass('swiper-slide')
	}
}



// Как дефицит железа влияет на жизнь
influenceSliders = []

function initInfluenceSliders() {
	if (window.outerWidth < 1024) {
		if ($('.influence .row').length) {
			$('.influence .row > *').addClass('swiper-slide')
			$('.influence .row').addClass('swiper-wrapper').removeClass('row')

			$('.influence .swiper').each(function (i) {
				$(this).addClass('influence_s' + i)

				let options = {
					loop: false,
					speed: 500,
					watchSlidesProgress: true,
					slideActiveClass: 'active',
					slideVisibleClass: 'visible',
					slidesPerView: 'auto',
					pagination: {
						el: '.swiper-pagination',
						type: 'bullets',
						clickable: true,
						bulletActiveClass: 'active'
					},
					breakpoints: {
						0: {
							spaceBetween: 15
						},
						540: {
							spaceBetween: 25
						}
					}
				}

				influenceSliders.push(new Swiper('.influence_s' + i, options))
			})
		}
	} else {
		influenceSliders.forEach(element => element.destroy(true, true))

		influenceSliders = []

		$('.influence .swiper-wrapper').addClass('row').removeClass('swiper-wrapper')
		$('.influence .row > *').removeClass('swiper-slide')
	}
}



// Выравнивание Мнений экспертов
function expertOpinionHeight(context, step) {
	let start = 0,
		finish = step,
		$items = context.find('.item')
	
	$items.height('auto')
	$items.find('.desc, .quote, .quote > *:first').height('auto')

	$items.each(function () {
		setHeight($items.slice(start, finish).find('.desc'))
		setHeight($items.slice(start, finish).find('.quote > *:first'))
		setHeight($items.slice(start, finish).find('.quote'))
		setHeight($items.slice(start, finish))

		start = start + step
		finish = finish + step
	})
}