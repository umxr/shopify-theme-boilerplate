import $ from 'jquery';

const BannerSection = (function() {
  const selectors = {
    hero_banner: '.banner-wrapper',
  };

  function Banner(container) {
    this.$container = $(container);
    this.settings = {};
    this.namespace = '.banner';
    this.initSlider();
  }

  Banner.prototype = $.extend({}, Banner.prototype, {
    initSlider() {
      $(selectors.hero_banner, this.$container).slick({
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: $(selectors.hero_banner, this.$container).data('banner-arrows'),
        dots: $(selectors.hero_banner, this.$container).data('banner-dots'),
      });
    },
    onReorder() {
      this.initSlider();
    },
    onBlockSelect(event) {
      const $block = $(event.target);
      const slideIndex = parseInt($block.data('slick-index'), 10);
      $(selectors.hero_banner, this.$container)
        .slick('slickGoTo', slideIndex)
        .slick('slickPause');
    },
    onBlockDeselect() {
      this.initSlider();
    },
    onUnload() {
      $(selectors.hero_banner, this.$container).slick('unslick');
    },
  });

  return Banner;
})();

export default BannerSection;
