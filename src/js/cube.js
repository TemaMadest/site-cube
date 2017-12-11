$(function() {
    var vp_width = $('#wrapper').width();
    var angle = 0;
    var index = 0;
    var animateDuration = 1500;
    var open_close = false;
    var d = document;
    var w = window;
    var hrefs = '';
    var grid = [
        $('.gr1'),
        $('.gr2'),
        $('.gr3'),
        $('.gr4')
    ];
    var busy = false;
    var active = $('nav').find('.active');
    var current = grid[0];

    var freed = function(){
        setTimeout(function(){
            busy = false;
        }, animateDuration);
    };

    var setActiveButton = function(a) {
        $('nav').find('a').removeClass('active');
        $(a).addClass('active');
        active = $(a);
    };

    var selectMenuItem = function() {
        if (!busy){            
            location.hash = $(this).attr('href');
            setActiveButton($(this));
            if (index < getIndex($(this))) {
                busy = true;
                rotateToright();
                hrefs = active.attr('href');
                getContent(hrefs, current);
                freed();
                index = getIndex($(this));                
            }
            if (index > getIndex($(this))) {
                busy = true;
                rotateToleft();
                hrefs = active.attr('href');
                getContent(hrefs, current);
                freed();
                index = getIndex($(this));
            }
        }        
        return false;
    };

    var selectMenuBtn = function() {
        if ($(this).hasClass("close")) {
            $('nav').css({
                left: '-230px'
            });
            $(this).removeClass('close');
        } else {
            $(this).addClass('close');
            $('nav').css({
                left: '0'
            });
        }
    };

    var active_index = function() {
        index = getIndex(active, '');
    };


    var leftHandler = function() {
        if (!busy){            
            var prev = active.parent().prev('li').children('a');
            if (prev.length) {
                if (index > 0) {
                    busy = true;
                    setActiveButton(prev);
                    index = getIndex(active, '');
                    rotateToleft();
                    hrefs = active.attr('href');
                    getContent(hrefs, current);
                    freed();
                    location.hash = active.attr('href');                    
                }
            }
        }        
    };

    var rightHandler = function() {
        if (!busy){
            var next = active.parent().next('li').children('a');
            if (next.length) {
                if (index < $('nav').find('li').length) {
                    busy = true;
                    setActiveButton(next);
                    index = getIndex(active, '');
                    rotateToright();
                    hrefs = active.attr('href');
                    getContent(hrefs, current);
                    freed();
                    location.hash = active.attr('href');
                }
            }
        }
    };

    var getIndex = function(elem, mod) {
        if (mod == 'prev') {
            return $(elem).parent().prev('li').index();
        } else if (mod == 'post') {
            return $(elem).parent().next('li').index();
        } else if (mod === '') {
            return $(elem).parent().index();
        } else {
            return $(elem).parent().index();
        }
    };

    var rotateToleft = function() {
        angle += 90;
        $('section').css({
            transform: 'perspective(900px) translate3d(0px,0px,' + vp_width / -2 + 'px) rotate3d(0,1,0,' + angle + 'deg)'
        });
        if (current.index() > 0) {
            current = grid[current.index() - 1];
        } else {
            current = grid[3];
        }
    };

    var rotateToright = function() {
        angle -= 90;
        $('section').css({
            transform: 'perspective(900px) translate3d(0px,0px,' + vp_width / -2 + 'px) rotate3d(0,1,0,' + angle + 'deg)'
        });
        if (current.index() < 3) {
            current = grid[current.index() + 1];
        } else {
            current = grid[0];
        }
    };

    var getContent = function(src, orientation) {
        var url = "";
        if(src){
            url = src;
            $(orientation).children('.gr1_1').children('.inner').empty();
            $(orientation).children('.gr1_1').children('.inner').load("/src/pages/" + src + ".html");
        }else{
            url = "404";
            rotateToright();
        }
        /*$.ajax({
            url: "sitename.ru",
            type: 'post',
            data: url
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

    var parses = function() {
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
    };

    var init = function() {
        vp_width = $(window).width();
        Custom_Resize(vp_width);
    };

    var ResizeWindow = function() {
        vp_width = $(window).width();
        Custom_Resize(vp_width);
        if (vp_width > 650) {
            $('.mobile-link').removeClass('close');
        }
    };

    var Custom_Resize = function(ww) {
        $('section').css({
            transform: 'perspective(900px) translate3d(0px,0px,' + ww / -2 + 'px) rotate3d(0,1,0,' + angle + 'deg)',
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
    $('.nav-panel').on('click', selectMenuItem);
    $('.mobile-link').on('click', selectMenuBtn);
    $('.left').on('click', leftHandler);
    $('.right').on('click', rightHandler);

    init();
    parses();
    active_index();
    getContent(active.attr('href'), current);
});