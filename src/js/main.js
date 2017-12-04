$(function(){
    var vp_width = $('#wrapper').width();
    var angle = 0; 
    var index = 0;
    var open_close = false;
    
    var hrefs = '';
    var grid = [];
        grid[0] = $('.gr1');
        grid[1] = $('.gr2');
        grid[2] = $('.gr3');
        grid[3] = $('.gr4');
    var current = grid[0];//по дефолту фронтальным является блок с классом .gr1
    
    
    $('.nav-panel').click(function(){
        location.hash = $(this).attr('href');//добавляем в адресную строку ссылку вида domain.ru/#...

        setActiveButton($(this));//выставляем активную кнопку в меню
        
        if(index < getIndex($(this))){
            rotateToright();    
            index = getIndex($(this));
        }
        if(index > getIndex($(this))){
            rotateToleft();  
            index = getIndex($(this));
        }
            
        return false;
    });


   $('.mobile-link').click(function() {
        if($(this).hasClass("close")){
            $('nav').css({left: '-230px'});
            $(this).removeClass('close');
        }else{
            $(this).addClass('close');
            $('nav').css({left: '0'});            
        }
    });
   


   
   
   /*Прокрутка вправа влево*/ 
    $('.left').click(function(){
        var prev = $('.active').parent().prev('li').children('a');
        if(prev){
            if(index > 0) {
                setActiveButton(prev);
                index = getIndex($('.active'),'');
                
                rotateToleft();
                
                location.hash = $('.active').attr('href');
            }
        }
    });
    
    $('.right').click(function(){
        var next = $('.active').parent().next('li').children('a');
        if(next){
            if(index < 6) {
                setActiveButton(next);
                index = getIndex($('.active'),'');

                rotateToright();
                
                location.hash = $('.active').attr('href');//добавляем в адресную строку ссылку вида domain.ru/#...
            }
        }
    });
    
    
    
    
    
    /*Адаптация под размер экрана*/
    $(window).resize(function(){
        vp_width = $(window).width();
        Custom_Resize(vp_width);
        
        if(vp_width > 650){
            $('.mobile-link').removeClass('close');
        }
    });
    
    
    
    
    
    
    
    /*Парсер*/
    var parse = function(){
        var loc = self.location.href;//содержимое адресной строки(тип String)
        var i = 0;
        var pos,href = "";
        var flag = false;
        
        while(i < loc.length){//пробежались по строке посмотрели есть ли '#', если есть, запоминаем позицию после нее(оттуда будем копировать адресс для ajax)
            if(loc[i] == "#"){
                pos = i+1;
                flag = true;
            }
            i++;
        }
        if(flag === true){
            href = loc.substring(pos);//выдергиваем адресс для аякса из адресной строки    
        }else{
            href = "index";
        }
        
        var elems = document.getElementsByTagName('a');//ищем активную ссылку присваиваем ей класс active
        for( var p = 0, elem; elem = elems[ p++ ]; ) {
            if ( elem.getAttribute('href') == href ) {
                $(elem).addClass('active');
                break;
            }
        }
				href = "/src/pages/"+href+".html";
        return href;
    };

    
    
    /*Указываем изначально какая ссылка активна, ее индекс*/
    var active_index = function(){
        index = getIndex($('.active'),'');
        //console.log(index);
    };

    


    /*Установка активного класса*/
    var setActiveButton = function(a){//снимаем со всех ссылок активные классы, устанавливаем на текущую
        $('a').removeClass('active');
        $(a).addClass('active'); 
    };
    
    
    
    
    
    /*Аякс запрос*/
    var getContent = function(url,orientation){//ajax request
        var inf = {};
            inf.url = url;
        
				
				$(orientation).children('.gr1_1').children('.inner').empty();
				$(orientation).children('.gr1_1').children('.inner').load("/src/pages/"+url+".html");
				
				
        /*$.ajax({
            url: 'http://www.masterr-balkonov.ru/ajax-request',
            type: 'post',
            data: inf
        })
        .done(function(res){
            $(orientation).children('.gr1_1').children('.inner').empty();
            $(orientation).children('.gr1_1').children('.inner').append(res);
            //$('.gr1_1').empty();
            //$('.gr1_1').append(res);
        })
        .error(function(err){
            console.log(err);
						throw(err);
        });*/
    };
    
    
    
    
    /*Функции поворота контента*/
    var rotateToleft = function(){
        angle +=90;
        $('section').css({transform: 'perspective(900px) translate3d(0px,0px,'+vp_width/-2+'px) rotate3d(0,1,0,'+angle+'deg)'}); 
        /*Производим смещение фронтального блока*/
        if(current.index() > 0){
            current = grid[current.index()-1];
        }else{
            current = grid[3];
        }
        hrefs = $('.active').attr('href');
        getContent(hrefs,current);
    };
    var rotateToright = function(){
        angle -= 90;
        $('section').css({transform: 'perspective(900px) translate3d(0px,0px,'+vp_width/-2+'px) rotate3d(0,1,0,'+angle+'deg)'});
        /*Производим смещение фронтального блока*/
        if(current.index() < 3){
            current = grid[current.index()+1];
        }else{
            current = grid[0];
        }
        hrefs = $('.active').attr('href');
        getContent(hrefs,current);
    };
    
    
    
    /*Функция получает елемент, смотрит его родителя, отправляет позицию родителя*/
    var getIndex = function(elem,mod){
        if(mod == 'prev'){
            return $(elem).parent().prev('li').index();
        }else if(mod == 'post'){
            return $(elem).parent().next('li').index();
        }else if(mod === ''){
            return $(elem).parent().index();
        }else{
            return $(elem).parent().index();
        }
    };
    
    var Custom_Resize = function(ww){
        //vp_width = $(window).width();
        
        $('section').css({
            transform: 'perspective(900px) translate3d(0px,0px,'+ww/-2+'px) rotate3d(0,1,0,'+angle+'deg)',
            'max-width': ww,
        });
        $('.gr1').css({
            transform: 'translate3d(0,0,'+ww/2+'px)',
        });
        $('.gr2').css({
            transform: 'translate3d(0,0,'+ww/2+'px) rotate3d(0,1,0,90deg)',
        });
        $('.gr4').css({
            transform: 'translate3d('+ww/-2+'px,0,0) rotate3d(0,1,0,-90deg)',
        });
        $('.gr3').css({
            transform: 'translate3d(0,0,'+ww/-2+'px) rotate3d(0,1,0,-180deg)',
        });
    };
    
    var init = function(w){
        if(w < 1200){
            Custom_Resize(w);
        }    
    };
    
    $(document).ready(function(){
        setTimeout($('.logo').addClass('close_logo'),2000);
        //$('.logo').addClass('close_logo');
    });
    
    init($(window).width());
    parse();
    active_index();
    getContent($('.active').attr('href'),current);
});