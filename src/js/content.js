(function(){
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
			$('.pick').removeClass('active');
			$(this).addClass('active');
			$('input[name="type"]').attr('value', $(this).attr('data-type'));
			$('.next-step').removeClass('disable');
		}
	};

	var backstepHandler = function(){
		$('#make-request').find('div[data-step="1"]').removeClass('hidden');
		$('#make-request').find('div[data-step="2"]').addClass('hidden');
	};

	var nextstepHandler = function(){	
		if($('.pick').hasClass('active')){
			$('#make-request').find('div[data-step="1"]').addClass('hidden');
			$('#make-request').find('div[data-step="2"]').removeClass('hidden');
		}
	};

	var order_anone = function(){		
		var serv = $(this).parent().parent().attr('data-title');
		$('#make-request-service').find('input[name="objects"]').attr('value', serv);
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
	var pickBtn = document.getElementsByClassName('pick');
	var order = document.getElementsByClassName('order-alone');
	var nextBtn = document.getElementsByClassName('next-step')[0];
	var backBtn = document.getElementsByClassName('back-btn')[0];
	for(var i = 0; i < pickBtn.length; i++) pickBtn[i].onclick = selectService;
	for(var i = 0; i < order.length; i++) order[i].onclick = order_anone;
	backBtn.onclick = backstepHandler;
	nextBtn.onclick = nextstepHandler;
}());