(function(){

	var application = {
		name: null,
		telephone: null,
		step: 1,
		service: null
	};

	//инициализация карты на главной странице
	var init = function(){
		var w = $(window).width();
		if(w > 1168) $('#maps').css({width: "1168px", height: "690px"});
		else $('#maps').css({width: w - 80 + "px", height: w / 1.5 + "px"});
		var placemark = [
			new ymaps.Placemark([55.678956, 37.626636], {hintContent: 'Варшавское шоссе 47', balloonContent: 'Варшавское шоссе 47' })			
		];
		var map = new ymaps.Map("maps", {
			center: [55.678956, 37.626636],
			zoom: 17
		});
		for(var i = 0; i < placemark.length; i++){
			map.geoObjects.add(placemark[i]);
		}
		map.behaviors.disable('scrollZoom');
	};    
	if(typeof ymaps !== "undefined" && $('#maps').length){
		ymaps.ready(init);
	}

	var selectService = function(){		
		if(!$(this).hasClass('active')){
			$('#case li').removeClass('active');
			$(this).addClass('active');
			application.service = $(this).attr('data-type');
		}
	};

	//обработчик выбора заказа услуги
	var handler = function(){
		var self = this;
		var servise_click_item = $('.items-left ul li');
		var servise_show_item = $('.items-right ul li');
		var id = $(this).attr('class');

		servise_show_item.each(function(i,e){
			if($(e).attr('data-item') == id){
				servise_show_item.removeClass('active');
				servise_click_item.removeClass('active');
				$(e).addClass('active');
				$(self).addClass('active');
			}
		});
	};

	$('.items-left ul li').on('click', handler);
	$('#case li').on('click', selectService);
}());