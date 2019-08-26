import $ from 'jquery';

const TestiomialSection = (function() {
  const selectors = {
    testimonial_slider: '.testimonial-slider',
  };

  function Testimonials(container) {
    this.$container = $(container);
    this.settings = {};
    this.namespace = '.banner';
    this.initTestimonials();
  }

  Testimonials.prototype = $.extend({}, Testimonials.prototype, {
    initTestimonials() {
      $(selectors.testimonial_slider, this.$container).slick({
        infinite: true,
        slidesToShow: 2,
        slidesToScroll: 1,
        arrows: $(selectors.testimonial_slider, this.$container).data(
          'banner-arrows'
        ),
        dots: $(selectors.testimonial_slider, this.$container).data(
          'banner-dots'
        ),
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
    onReorder() {
      this.initTestimonials();
    },
    onBlockSelect(event) {
      const $block = $(event.target);
      const slideIndex = parseInt($block.data('slick-index'), 10);
      $(selectors.testimonial_slider, this.$container)
        .slick('slickGoTo', slideIndex)
        .slick('slickPause');
    },
    onUnload() {
      $(selectors.testimonial_slider, this.$container).slick('unslick');
    },
  });

  return Testimonials;
})();

export default TestiomialSection;
