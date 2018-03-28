(function() {
    let vp_width = $('#wrapper').width(),
        angle = 0,
        index = 0,
        animateDuration = 2700, //задержка клика в пункте меню после поворота
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
        jsScrollAnimate = null,
        wrapper = $('#wrapper'),
        mobileBtn = $('.mobile-link'),
        menuBtn = $('.nav-panel'),
        leftBtn = $('.left'),
        rightBtn = $('.right'),
        locate = document.location.hostname,
        isDemo = locate == "localhost" || locate == "192.138.0.183",




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


        leftHandler = () => {
            if (!busy){            
                let prev = active.parent().prev('li').children('a');
                if (prev.length) {
                    if (index > 0) {
                        closeMenu();
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

        rightHandler = () => {
            if (!busy){            
                let next = active.parent().next('li').children('a');
                if (next.length) {
                    if (index < $('nav').find('li').length) {
                        closeMenu();
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
            if (current.index() > 0) {
                current = grid[current.index() - 1];
            } else {
                current = grid[3];
            }
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
                for(let i = 0; i < grid.length; i++){
                    if(current !== grid[i]) $(grid[i]).find('.inner').empty();
                }
            },2300);            
            freed();
        },

        rotateToright = function() {
            if (current.index() < 3) {
                current = grid[current.index() + 1];
            } else {
                current = grid[0];
            }
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
                for(let i = 0; i < grid.length; i++){
                    if(current !== grid[i]) $(grid[i]).find('.inner').empty();
                }            
            },2300);            
            freed();              
        },

        getContent = function(src) {
            if(src){             
                request(src);
            }   
        },

        request = function(url){
            let path = isDemo ? "../src/pages/" + url + ".html" : "/request";
            $.ajax({
                method: isDemo ? "GET" : "POST",
                url: path,
                data: {action: url},
                beforeSend: addLoader()
            })
            .success(function(res){
                $(current).find('.inner').empty();
                $(current).find('.inner').append(res);
                if(!wait && busy){
                    wait = true;
                }else{
                    closeLoader();
                }
            })
            .error(function(err){
                $(current).find('.inner').empty();
                $(current).find('.inner').append(err);
            });
        },

        addLoader = function(){
            wait = false;
            $('.gr1_1').removeClass('load');
            $(current).find('.gr1_1').addClass('load');
        },

        closeLoader = function(){            
            $(current).find('.gr1_1').addClass('loaded');
            setTimeout(() => {
                initScroller();
                $(current).find('.gr1_1').removeClass('load loaded');
            },500);
        },

        parses = function() {
            let loc = location.href,
                i = 0,
                pos, href = "",
                flag = false;
            while (i < loc.length) {
                if (loc[i] == "#") {
                    pos = i + 1;
                    flag = true;
                }
                i++;
            }
            if (flag === true) {
                href = loc.substring(pos);
            }else{
                href = "index";
            }
            let elems = $('nav').find('a');
            for (let p = 0, elem; elem = elems[p++];) {
                if (elem.getAttribute('href') == href) {
                    $(elem).addClass('active');
                    active = $(elem);
                    break;
                }
            }
        },

        initScroller = () => {
            if(scroller) scroller.destroy();
            scroller = new PerfectScrollbar(current.find('.gr1_1')[0]);
            if(jsScrollAnimate) jsScrollAnimate.destroy();
            jsScrollAnimate = new Scroll(current);
            jsScrollAnimate.init();
        },

        getWindowSize = () => {
            return $(window).width()
        },

        init = function() {
            vp_width = getWindowSize();
            Custom_Resize(vp_width);
            parses();
            active_index();
            getContent(active.attr('href'));
        },

        ResizeWindow = () => {
            vp_width = getWindowSize();
            Custom_Resize(vp_width);
            if (vp_width > 650) {
                $('.mobile-link').removeClass('close');
            }
        },

        changeHash = function() {
            if(!busy){
                parses();
                active_index();
                setActiveButton(active);
                getContent(active.attr('href'));
            }
        },

        loader = function() {
            $('#wrapper').addClass('animateResize');
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
    leftBtn.on('click', leftHandler);
    rightBtn.on('click', rightHandler);
    $(w).on('hashchange', changeHash);
    $(w).on('load', loader);

    init();
}());