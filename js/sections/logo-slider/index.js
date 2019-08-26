import $ from 'jquery';

const LogoSliderSection = (function() {
  const selectors = {
    logo_slider: '.logo-slider',
  };

  function LogoSlider(container) {
    this.$container = $(container);
    this.settings = {};
    this.namespace = '.logo-slide';
    this.initLogoSlider();
  }

  LogoSlider.prototype = $.extend({}, LogoSlider.prototype, {
    initLogoSlider() {
      $(selectors.logo_slider, this.$container).slick({
        infinite: true,
        slidesToShow: $(selectors.logo_slider, this.$container).data(
          'slides-to-show'
        ),
        slidesToScroll: 1,
        arrows: $(selectors.logo_slider, this.$container).data('banner-arrows'),
        dots: $(selectors.logo_slider, this.$container).data('banner-dots'),
        responsive: [
          {
            breakpoint: 768,
            settings: {
              slidesToShow: 1,
            },
          },
        ],
      });
    },
    onBlockSelect(event) {
      const $block = $(event.target);
      const slideIndex = parseInt($block.data('slick-index'), 10);
      $(selectors.logo_slider, this.$container)
        .slick('slickGoTo', slideIndex)
        .slick('slickPause');
    },
    onUnload() {
      $(selectors.logo_slider, this.$container).slick('unslick');
    },
  });

  return LogoSlider;
})();

export default LogoSliderSection;
