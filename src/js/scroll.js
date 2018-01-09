var Scroll = (function (container) {

  var w = $(container).find('.gr1_1')[0],
      wH = $(w).height(),
      wScrollPos = $(w).scrollTop(),
      viewPos = wScrollPos + wH,
      hScrollPos = $('header')[0].offsetHeight,
      $els = $(w).find('.js-scroll-animate'),
  
  updateValues = function () {
    wH = $(w).height();
    wScrollPos = $(w).scrollTop();
    viewPos = wScrollPos + wH;
  },
  
  scroll = function () {
    updateValues();
    $els.each(function () {
      var t = $(this),
          offset = t.offset().top;
      if (((viewPos >= offset) && (offset >= wScrollPos)) || (viewPos > offset) && (offset <= wScrollPos)) {
        t.removeClass('js-scroll-animate').addClass('js-scroll-done');
        $els = $('.js-scroll-animate');
      }
    });
  },
  
  handler = function(){
    scroll();
  };

  this.init = function () {
    $(w).on('scroll', handler);
    scroll();
  };

  this.destroy = function(){
    $(w).off('scroll', handler);
  };

});