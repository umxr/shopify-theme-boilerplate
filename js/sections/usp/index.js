import $ from 'jquery';

const UspSection = (function() {
  const selectors = {
    usps: '.usps-wrapper',
  };

  function Usps(container) {
    this.$container = $(container);
    this.settings = {};
    this.namespace = '.usp';
    this.initSlider();
    this.resizeSlider();
  }

  Usps.prototype = $.extend({}, Usps.prototype, {
    initSlider() {
      if ($(window).width() <= 768) {
        if (!$(selectors.usps, this.$container).hasClass('slick-initialized')) {
          $(selectors.usps, this.$container).slick({
            infinite: true,
            slidesToShow: 1,
            slidesToScroll: 1,
            arrows: false,
            dots: false,
          });
        }
      } else if (
        $(selectors.usps, this.$container).hasClass('slick-initialized')
      ) {
        $(selectors.usps, this.$container).slick('unslick');
      }
    },
    resizeSlider() {
      $(window).on('load resize orientationchange', this.initSlider);
    },
    onReorder() {
      this.initSlider();
    },
    onBlockSelect(event) {
      if ($(selectors.usps, this.$container).hasClass('slick-initialized')) {
        const $block = $(event.target);
        const slideIndex = parseInt($block.data('slick-index'), 10);
        $(selectors.usps, this.$container)
          .slick('slickGoTo', slideIndex)
          .slick('slickPause');
      }
    },
    onBlockDeselect() {
      this.initSlider();
    },
    onUnload() {
      if ($(selectors.usps, this.$container).hasClass('slick-initialized')) {
        $(selectors.usps, this.$container).slick('unslick');
      }
    },
  });

  return Usps;
})();

export default UspSection;
