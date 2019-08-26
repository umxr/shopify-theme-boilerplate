// Modules
import $ from 'jquery';
import 'element-matches';
import * as a11y from '@shopify/theme-a11y';
import * as rte from '@shopify/theme-rte';

// Core
import theme from './core/theme';
import slate from './core/slate';

// Util
import { findInstance } from './core/slate/util';
import GenerateProduct from './templates/product';

/*= =============== Slate ================ */

/**
 * Cart Template Script
 * ------------------------------------------------------------------------------
 * A file that contains scripts highly couple code to the Cart template.
 *
 * @namespace cart
 */

slate.cart = {
  /**
   * Browser cookies are required to use the cart. This function checks if
   * cookies are enabled in the browser.
   */
  cookiesEnabled() {
    let { cookieEnabled } = navigator;

    if (!cookieEnabled) {
      document.cookie = 'testcookie';
      cookieEnabled = document.cookie.indexOf('testcookie') !== -1;
    }
    return cookieEnabled;
  },
};

slate.Sections = function Sections() {
  this.constructors = {};
  this.instances = [];

  $(document)
    .on('shopify:section:load', this._onSectionLoad.bind(this))
    .on('shopify:section:unload', this._onSectionUnload.bind(this))
    .on('shopify:section:select', this._onSelect.bind(this))
    .on('shopify:section:deselect', this._onDeselect.bind(this))
    .on('shopify:section:reorder', this._onReorder.bind(this))
    .on('shopify:block:select', this._onBlockSelect.bind(this))
    .on('shopify:block:deselect', this._onBlockDeselect.bind(this));
};
slate.Sections.prototype = $.extend({}, slate.Sections.prototype, {
  _createInstance(container, constructor) {
    const $container = $(container);
    const id = $container.attr('data-section-id');
    const type = $container.attr('data-section-type');

    constructor = constructor || this.constructors[type];

    if (typeof constructor === 'undefined') {
      return;
    }

    const instance = $.extend(new constructor(container), {
      id,
      type,
      container,
    });

    this.instances.push(instance);
  },

  _onSectionLoad(evt) {
    const container = $('[data-section-id]', evt.target)[0];
    if (container) {
      this._createInstance(container);
    }
  },

  _onSectionUnload(evt) {
    const instance = findInstance(this.instances, 'id', evt.detail.sectionId);

    if (!instance) {
      return;
    }

    if (typeof instance.onUnload === 'function') {
      instance.onUnload(evt);
    }

    this.instances = removeInstance(this.instances, 'id', evt.detail.sectionId);
  },

  _onSelect(evt) {
    const instance = findInstance(this.instances, 'id', evt.detail.sectionId);

    if (instance && typeof instance.onSelect === 'function') {
      instance.onSelect(evt);
    }
  },

  _onDeselect(evt) {
    const instance = findInstance(this.instances, 'id', evt.detail.sectionId);

    if (instance && typeof instance.onDeselect === 'function') {
      instance.onDeselect(evt);
    }
  },

  _onReorder(evt) {
    const instance = findInstance(this.instances, 'id', evt.detail.sectionId);

    if (instance && typeof instance.onReorder === 'function') {
      instance.onReorder(evt);
    }
  },

  _onBlockSelect(evt) {
    const instance = findInstance(this.instances, 'id', evt.detail.sectionId);

    if (instance && typeof instance.onBlockSelect === 'function') {
      instance.onBlockSelect(evt);
    }
  },

  _onBlockDeselect(evt) {
    const instance = findInstance(this.instances, 'id', evt.detail.sectionId);

    if (instance && typeof instance.onBlockDeselect === 'function') {
      instance.onBlockDeselect(evt);
    }
  },

  register(type, constructor) {
    this.constructors[type] = constructor;

    $(`[data-section-type=${type}]`).each(
      function(index, container) {
        this._createInstance(container, constructor);
      }.bind(this)
    );
  },
});

/*= =============== Templates ================ */
/**
 * Customer Addresses Script
 * ------------------------------------------------------------------------------
 * A file that contains scripts highly couple code to the Customer Addresses
 * template.
 *
 * @namespace customerAddresses
 */

theme.customerAddresses = function() {
  const $newAddressForm = $('#AddressNewForm');

  if (!$newAddressForm.length) {
    return;
  }

  // Initialize observers on address selectors, defined in shopify_common.js
  if (Shopify) {
    new Shopify.CountryProvinceSelector(
      'AddressCountryNew',
      'AddressProvinceNew',
      {
        hideElement: 'AddressProvinceContainerNew',
      }
    );
  }

  // Initialize each edit form's country/province selector
  $('.address-country-option').each(function() {
    const formId = $(this).data('form-id');
    const countrySelector = `AddressCountry_${formId}`;
    const provinceSelector = `AddressProvince_${formId}`;
    const containerSelector = `AddressProvinceContainer_${formId}`;

    new Shopify.CountryProvinceSelector(countrySelector, provinceSelector, {
      hideElement: containerSelector,
    });
  });

  // Toggle new/edit address forms
  $('.address-new-toggle').on('click', function() {
    $newAddressForm.toggleClass('is-hidden');
  });

  $('.address-edit-toggle').on('click', function() {
    const formId = $(this).data('form-id');
    $(`#EditAddress_${formId}`).toggleClass('is-hidden');
  });

  $('.address-delete').on('click', function() {
    const $el = $(this);
    const formId = $el.data('form-id');
    const confirmMessage = $el.data('confirm-message');
    if (
      confirm(confirmMessage || 'Are you sure you wish to delete this address?')
    ) {
      Shopify.postLink(`/account/addresses/${formId}`, {
        parameters: { _method: 'delete' },
      });
    }
  });
};

/**
 * Reset Password Template Script
 * ------------------------------------------------------------------------------
 * A file that contains scripts highly couple code to the Reset Password template.
 *
 * @namespace password
 */

theme.customerLogin = function() {
  const config = {
    recoverPasswordForm: '#RecoverPassword',
    hideRecoverPasswordLink: '#HideRecoverPasswordLink',
  };

  if (!$(config.recoverPasswordForm).length) {
    return;
  }

  checkUrlHash();
  resetPasswordSuccess();

  $(config.recoverPasswordForm).on('click', onShowHidePasswordForm);
  $(config.hideRecoverPasswordLink).on('click', onShowHidePasswordForm);

  function onShowHidePasswordForm(evt) {
    evt.preventDefault();
    toggleRecoverPasswordForm();
  }

  function checkUrlHash() {
    const { hash } = window.location;

    // Allow deep linking to recover password form
    if (hash === '#recover') {
      toggleRecoverPasswordForm();
    }
  }

  /**
   *  Show/Hide recover password form
   */
  function toggleRecoverPasswordForm() {
    $('#RecoverPasswordForm').toggleClass('is-hidden');
    $('#CustomerLoginForm').toggleClass('is-hidden');
  }

  /**
   *  Show reset password success message
   */
  function resetPasswordSuccess() {
    const $formState = $('.reset-password-success');

    // check if reset password form was successfully submited.
    if (!$formState.length) {
      return;
    }

    // show success message
    $('#ResetSuccess').removeClass('is-hidden');
  }
};

/**
 * Password Template Script
 * ------------------------------------------------------------------------------
 * A file that contains scripts highly couple code to the Password template.
 *
 * @namespace password
 */

theme.passwordLogin = function() {
  const config = {
    passwordForm: '#PasswordLogin',
    passwordLink: '#PasswordLoginLink',
  };

  if (!$(config.passwordForm).length) {
    return;
  }

  $(config.passwordLink).on('click', function(e) {
    e.preventDefault();
    $(config.passwordForm).toggleClass('is-hidden');
  });
};

theme.navToggle = function() {
  // Get all "navbar-burger" elements
  const $navbarBurgers = Array.prototype.slice.call(
    document.querySelectorAll('.navbar-burger'),
    0
  );

  // Check if there are any navbar burgers
  if ($navbarBurgers.length > 0) {
    // Add a click event on each of them
    $navbarBurgers.forEach(el => {
      el.addEventListener('click', () => {
        // Get the target from the "data-target" attribute
        const { target } = el.dataset;
        const $target = document.getElementById(target);

        // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
        el.classList.toggle('is-active');
        $target.classList.toggle('is-active');
      });
    });
  }
};

/**
 * Product Tabs
 */
theme.Tabs = (function() {
  const selectors = {
    tabs: '.tabs',
  };

  function Tabs(container) {
    this.$container = $(container);
    const sectionId = this.$container.attr('data-section-id');
    this.settings = {};
    this.namespace = '.tab';

    this.initTabs();
  }

  Tabs.prototype = $.extend({}, Tabs.prototype, {
    initTabs() {
      $(`${selectors.tabs} ul > li`).on('click', function() {
        $(`${selectors.tabs} ul > li`).removeClass('is-active');
        $(this).addClass('is-active');
        $(`${selectors.tabs} ul > div`).slideUp();
        $(this)
          .next('div')
          .slideToggle();
      });
    },
    onBlockSelect(event) {
      let $block;
      $block = $(event.target);
      $block.trigger('click');
    },
  });

  return Tabs;
})();
/**
 * Usps Slider On Mobile
 */
theme.Usps = (function() {
  const selectors = {
    usps: '.usps-wrapper',
  };

  function Usps(container) {
    this.$container = $(container);
    const sectionId = this.$container.attr('data-section-id');

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
        let $block;
        let slideIndex;
        $block = $(event.target);
        slideIndex = parseInt($block.data('slick-index'), 10);
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

/**
 * Hero Banner
 */
theme.Banner = (function() {
  const selectors = {
    hero_banner: '.banner-wrapper',
  };

  function Banner(container) {
    this.$container = $(container);
    const sectionId = this.$container.attr('data-section-id');

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
      let $block;
      let slideIndex;
      $block = $(event.target);
      slideIndex = parseInt($block.data('slick-index'), 10);
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

/**
 * Logo Slider
 */
theme.LogoSlider = (function() {
  const selectors = {
    logo_slider: '.logo-slider',
  };

  function LogoSlider(container) {
    this.$container = $(container);
    const sectionId = this.$container.attr('data-section-id');

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
      let $block;
      let slideIndex;
      $block = $(event.target);
      slideIndex = parseInt($block.data('slick-index'), 10);
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

/**
 * Testimonials Slider
 */
theme.Testimonials = (function() {
  const selectors = {
    testimonial_slider: '.testimonial-slider',
  };

  function Testimonials(container) {
    this.$container = $(container);
    const sectionId = this.$container.attr('data-section-id');

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
      let $block;
      let slideIndex;
      $block = $(event.target);
      slideIndex = parseInt($block.data('slick-index'), 10);
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

/**
 * Image Slider
 */
theme.ImageSlider = (function() {
  const selectors = {
    image_slider: '.image-slider',
  };

  function ImageSlider(container) {
    this.$container = $(container);
    const sectionId = this.$container.attr('data-section-id');

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
      let $block;
      let slideIndex;
      $block = $(event.target);
      slideIndex = parseInt($block.data('slick-index'), 10);
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

// Theme Cache
theme.cacheSelectors = function() {
  theme.cache = {
    $html: $('html'),
    $body: $('body'),

    $modals: $('.modal'),
    $modalTrigger: $('.modal-trigger'),
    $modalCloses: $(
      '.modal-background, .modal-close, .modal-card-head .delete, .modal-card-foot .button'
    ),
  };
};

theme.modal = function() {
  theme.cache.$modalTrigger.on('click', function(e) {
    e.preventDefault();
    const trigger = $(this);
    const target = trigger.data('target');

    $(target).addClass('is-active');
    theme.cache.$html.addClass('is-clipped');
  });

  theme.cache.$modalCloses.on('click', function(e) {
    theme.closeModals();
  });

  $(document).on('keyup', function(e) {
    if (e.keyCode == 27) {
      theme.closeModals();
    }
  });
};

theme.closeModals = function() {
  theme.cache.$html.removeClass('is-clipped');
  theme.cache.$modals.removeClass('is-active');
  $('#product-video iframe').attr(
    'src',
    $('#product-video iframe').attr('src')
  );
};

$(document).ready(function() {
  // Run section based JS
  const sections = new slate.Sections();
  sections.register('product', GenerateProduct);
  sections.register('product-tabs', theme.Tabs);
  sections.register('usps-section', theme.Usps);
  sections.register('hero-banner-section', theme.Banner);
  sections.register('logo-slider-section', theme.LogoSlider);
  sections.register('testimonial-section', theme.Testimonials);
  sections.register('image-slider-section', theme.ImageSlider);

  // Common a11y fixes
  a11y.bindInPageLinks();

  // Wrap videos in div to force responsive layout.
  rte.wrapTable();
  rte.iframeReset();

  // Apply a specific class to the html element for browser support of cookies.
  if (slate.cart.cookiesEnabled()) {
    document.documentElement.className = document.documentElement.className.replace(
      'supports-no-cookies',
      'supports-cookies'
    );
  }

  // Run the theme related functions
  theme.passwordLogin();
  theme.customerLogin();
  theme.customerAddresses();
  theme.navToggle();
  theme.cacheSelectors();
  theme.modal();
});
