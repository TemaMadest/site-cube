(function(){

	let body = $('body');

	let handler = function(){
		let self = this;
		let servise_click_item = $('.items-left ul li');
		let servise_show_item = $('.items-right ul li');
		let id = $(this).attr('class');

		servise_show_item.each(function(i,e){
			if($(e).attr('data-item') == id){
				servise_show_item.removeClass('active');
				servise_click_item.removeClass('active');
				$(e).addClass('active');
				$(self).addClass('active');
			}
		});
	};

	body.on('click', '.items-left ul li', handler);

}());

