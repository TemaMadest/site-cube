$(function() {
    var vp_width = $('#wrapper').width(),
    angle = 0,
    index = 0,
    animateDuration = 3000, //задержка клика в пункте меню после поворота
    open_close = false,
    d = document,
    w = window,
    hrefs = '',
    perspective = 2000,
    grid = [
        $('.gr1'),
        $('.gr2'),
        $('.gr3'),
        $('.gr4')
    ],
    busy = false,
    wait = false,
    active = $('nav').find('.active'),
    current = grid[0],
    scroller = null,
    wrapper = $('#wrapper'),
    mobileBtn = $('.mobile-link'),
    menuBtn = $('.nav-panel'),
    leftBtn = $('.left'),
    rightBtn = $('.right'),




    /*******************Methods******************/

    freed = function(){
        setTimeout(() => {
            busy = false;
            if(!wait){
                wait = true;
            }else{
                closeLoader();
            }
        }, animateDuration);
    },

    setActiveButton = function(a) {
        $('nav').find('a').removeClass('active');
        $(a).addClass('active');
        active = $(a);
    },

    selectMenuItem = function() {
        if (!busy){
            location.hash = $(this).attr('href');
            setActiveButton($(this));
            closeMenu();
            if (index < getIndex($(this))) {
                busy = true;
                rotateToright();
                hrefs = active.attr('href');
                getContent(hrefs);
                index = getIndex($(this));                
            }
            if (index > getIndex($(this))) {
                busy = true;
                rotateToleft();
                hrefs = active.attr('href');
                getContent(hrefs);
                index = getIndex($(this));
            }
        }        
        return false;
    },

    selectMenuBtn = function() {
        if ($(this).hasClass("close")) {
            $('nav').css({
                left: '-100%'
            });
            $(this).removeClass('close');
        } else {
            $(this).addClass('close');
            $('nav').css({
                left: '0'
            });
        }
    },

    closeMenu = () => {
        if (isMobile.any){
            if ($('.mobile-link').hasClass("close")) $('.mobile-link').removeClass('close');
            $('nav').css({left: '-100%'});            
        }
    },

    active_index = function() {
        index = getIndex(active, '');
    },


    leftHandler = function() {
        if (!busy){            
            var prev = active.parent().prev('li').children('a');
            if (prev.length) {
                if (index > 0) { 
                    busy = true;
                    setActiveButton(prev);
                    index = getIndex(active, '');
                    rotateToleft();
                    hrefs = active.attr('href');
                    getContent(hrefs);
                    location.hash = active.attr('href');
                }
            }
        }        
    },

    rightHandler = function() {
        if (!busy){
            var next = active.parent().next('li').children('a');
            if (next.length) {
                if (index < $('nav').find('li').length) {                    
                    busy = true;
                    setActiveButton(next);
                    index = getIndex(active, '');
                    rotateToright();
                    hrefs = active.attr('href');
                    getContent(hrefs);
                    location.hash = active.attr('href');                        
                }
            }
        }
    },

    getIndex = function(elem, mod) {
        if (mod == 'prev') {
            return $(elem).parent().prev('li').index();
        } else if (mod == 'post') {
            return $(elem).parent().next('li').index();
        } else if (mod === '') {
            return $(elem).parent().index();
        } else {
            return $(elem).parent().index();
        }
    },

    rotateToleft = function() {
        wrapper.addClass('extrude');
        $('section').css({transform: 'perspective(' + perspective + 'px) translate3d(0px,0px,' + vp_width / -1.3 + 'px) rotate3d(0,1,0,' + angle + 'deg)'});
        angle += 90;
        setTimeout(() => {
            wrapper.removeClass('extrude');
            $('section').css({transform: 'perspective(' + perspective + 'px) translate3d(0px,0px,' + vp_width / -1.3 + 'px) rotate3d(0,1,0,' + angle + 'deg)'});
        },500);
        setTimeout(() => {
            wrapper.addClass('extrude');
            $('section').css({transform: 'perspective(' + perspective + 'px) translate3d(0px,0px,' + vp_width / -2 + 'px) rotate3d(0,1,0,' + angle + 'deg)'});
        },2500);
        if (current.index() > 0) {
            current = grid[current.index() - 1];
        } else {
            current = grid[3];
        }
        freed();
    },

    rotateToright = function() {
        wrapper.addClass('extrude');
        $('section').css({transform: 'perspective(' + perspective + 'px) translate3d(0px,0px,' + vp_width / -1.3 + 'px) rotate3d(0,1,0,' + angle + 'deg)'});        
        angle -= 90;
        setTimeout(() => {
            wrapper.removeClass('extrude');
            $('section').css({transform: 'perspective(' + perspective + 'px) translate3d(0px,0px,' + vp_width / -1.3 + 'px) rotate3d(0,1,0,' + angle + 'deg)'});
        },500);
        setTimeout(() => {
            wrapper.addClass('extrude');
            $('section').css({transform: 'perspective(' + perspective + 'px) translate3d(0px,0px,' + vp_width / -2 + 'px) rotate3d(0,1,0,' + angle + 'deg)'});            
        },2500);
        if (current.index() < 3) {
            current = grid[current.index() + 1];
        } else {
            current = grid[0];
        }
        freed();              
    },

    getContent = function(src) {
        if(src){
            $(current).find('.inner').empty();            
            request(src);
        }   
    },

    request = function(url){
        $.ajax({
            url: "../src/pages/" + url + ".html",
            data: url,
            beforeSend: addLoader()
        })
        .success(function(res){        
            $(current).find('.inner').append(res);            
            if(!wait && busy){
                wait = true;
            }else{
                closeLoader();
            }
        })
        .error(function(err){
            console.log(err);
        }); 
    },

    addLoader = function(){
        wait = false;
        $('.gr1_1').removeClass('load');
        $(current).find('.gr1_1').addClass('load');
    },

    closeLoader = function(){
        initScroller();
        $(current).find('.gr1_1').addClass('loaded');
        setTimeout(() => {
            $(current).find('.gr1_1').removeClass('load loaded');
        },500);
    },

    parses = function() {
        var loc = location.href;
        var i = 0;
        var pos, href = "";
        var flag = false;
        while (i < loc.length) {
            if (loc[i] == "#") {
                pos = i + 1;
                flag = true;
            }
            i++;
        }
        if (flag === true) {
            href = loc.substring(pos);
        } else {
            href = "index";
        }
        var elems = $('nav').find('a');
        for (var p = 0, elem; elem = elems[p++];) {
            if (elem.getAttribute('href') == href) {
                $(elem).addClass('active');
                active = $(elem);
                break;
            }
        }
    },

    initScroller = function(){
        if(scroller) scroller.destroy();
        scroller = new PerfectScrollbar(current.find('.gr1_1')[0]);
    },

    init = function() {
        vp_width = $(window).width();
        Custom_Resize(vp_width);
    },

    ResizeWindow = function() {
        vp_width = $(window).width();
        Custom_Resize(vp_width);
        if (vp_width > 650) {
            $('.mobile-link').removeClass('close');
        }
    },

    Custom_Resize = function(ww) {
        $('section').css({
            transform: 'perspective(' + perspective + 'px) translate3d(0px,0px,' + ww / -2 + 'px) rotate3d(0,1,0,' + angle + 'deg)',
            'max-width': ww,
        });
        $('.gr1').css({
            transform: 'translate3d(0,0,' + ww / 2 + 'px)',
        });
        $('.gr2').css({
            transform: 'translate3d(0,0,' + ww / 2 + 'px) rotate3d(0,1,0,90deg)',
        });
        $('.gr4').css({
            transform: 'translate3d(' + ww / -2 + 'px,0,0) rotate3d(0,1,0,-90deg)',
        });
        $('.gr3').css({
            transform: 'translate3d(0,0,' + ww / -2 + 'px) rotate3d(0,1,0,-180deg)',
        });
    };

    $(w).on('resize', ResizeWindow);
    menuBtn.on('click', selectMenuItem);
    mobileBtn.on('click', selectMenuBtn);
    $('.left').on('click', leftHandler);
    $('.right').on('click', rightHandler);

    init();
    parses();
    active_index();
    getContent(active.attr('href'));
});