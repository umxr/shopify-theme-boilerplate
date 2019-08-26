import $ from 'jquery';

const ImageSliderSection = (function() {
  const selectors = {
    image_slider: '.image-slider',
  };

  function ImageSlider(container) {
    this.$container = $(container);
    this.settings = {};
    this.namespace = '.banner';

    this.initImageSlider();
  }

  ImageSlider.prototype = $.extend({}, ImageSlider.prototype, {
    initImageSlider() {
      $(selectors.image_slider, this.$container).slick({
        infinite: true,
        slidesToShow: 5,
        slidesToScroll: 1,
        centerMode: true,
        arrows: false,
        dots: true,
        focusOnSelect: true,
        responsive: [
          {
            breakpoint: 1024,
            settings: {
              slidesToShow: 3,
              slidesToScroll: 3,
            },
          },
          {
            breakpoint: 768,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1,
            },
          },
        ],
      });
    },
    onReorder() {
      this.initImageSlider();
    },
    onBlockSelect(event) {
      const $block = $(event.target);
      const slideIndex = parseInt($block.data('slick-index'), 10);
      $(selectors.image_slider, this.$container)
        .slick('slickGoTo', slideIndex)
        .slick('slickPause');
    },
    onBlockDeselect() {
      this.initImageSlider();
    },
    onUnload() {
      $(selectors.image_slider, this.$container).slick('unslick');
    },
  });

  return ImageSlider;
})();

export default ImageSliderSection;
