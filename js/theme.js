const { slate = {}, theme = {} } = window;

/*= =============== Slate ================ */
/**
 * A11y Helpers
 * -----------------------------------------------------------------------------
 * A collection of useful functions that help make your theme more accessible
 * to users with visual impairments.
 *
 *
 * @namespace a11y
 */

slate.a11y = {
  /**
   * For use when focus shifts to a container rather than a link
   * eg for In-page links, after scroll, focus shifts to content area so that
   * next `tab` is where user expects if focusing a link, just $link.focus();
   *
   * @param {JQuery} $element - The element to be acted upon
   */
  pageLinkFocus($element) {
    const focusClass = 'js-focus-hidden';

    $element
      .first()
      .attr('tabIndex', '-1')
      .focus()
      .addClass(focusClass)
      .one('blur', callback);

    function callback() {
      $element
        .first()
        .removeClass(focusClass)
        .removeAttr('tabindex');
    }
  },

  /**
   * If there's a hash in the url, focus the appropriate element
   */
  focusHash() {
    const { hash } = window.location;

    // is there a hash in the url? is it an element on the page?
    if (hash && document.getElementById(hash.slice(1))) {
      this.pageLinkFocus($(hash));
    }
  },

  /**
   * When an in-page (url w/hash) link is clicked, focus the appropriate element
   */
  bindInPageLinks() {
    $('a[href*=#]').on(
      'click',
      function(evt) {
        this.pageLinkFocus($(evt.currentTarget.hash));
      }.bind(this)
    );
  },

  /**
   * Traps the focus in a particular container
   *
   * @param {object} options - Options to be used
   * @param {jQuery} options.$container - Container to trap focus within
   * @param {jQuery} options.$elementToFocus - Element to be focused when focus leaves container
   * @param {string} options.namespace - Namespace used for new focus event handler
   */
  trapFocus(options) {
    const eventName = options.namespace
      ? `focusin.${options.namespace}`
      : 'focusin';

    if (!options.$elementToFocus) {
      options.$elementToFocus = options.$container;
    }

    options.$container.attr('tabindex', '-1');
    options.$elementToFocus.focus();

    $(document).on(eventName, function(evt) {
      if (
        options.$container[0] !== evt.target &&
        !options.$container.has(evt.target).length
      ) {
        options.$container.focus();
      }
    });
  },

  /**
   * Removes the trap of focus in a particular container
   *
   * @param {object} options - Options to be used
   * @param {jQuery} options.$container - Container to trap focus within
   * @param {string} options.namespace - Namespace used for new focus event handler
   */
  removeTrapFocus(options) {
    const eventName = options.namespace
      ? `focusin.${options.namespace}`
      : 'focusin';

    if (options.$container && options.$container.length) {
      options.$container.removeAttr('tabindex');
    }

    $(document).off(eventName);
  },

  /**
   * Check for Enter/Return or Space being pressed as well as click
   *
   * $('element').on('click keypress', function(event){
   *  if(slate.a11y.keyOrClick(event) === true){
   *   do something
   *  }
   * });
   */
  keyOrClick(event) {
    if (event.type === 'click') {
      return true;
    }
    if (event.type === 'keypress') {
      const code = event.charCode || event.keyCode;
      if (code === 32 || code === 13) {
        return true;
      }
    } else {
      return false;
    }
  },
};

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

/**
 * Utility helpers
 * -----------------------------------------------------------------------------
 * A collection of useful functions for dealing with arrays and objects
 *
 * @namespace utils
 */

slate.utils = {
  /**
   * Return an object from an array of objects that matches the provided key and value
   *
   * @param {array} array - Array of objects
   * @param {string} key - Key to match the value against
   * @param {string} value - Value to get match of
   */
  findInstance(array, key, value) {
    for (let i = 0; i < array.length; i++) {
      if (array[i][key] === value) {
        return array[i];
      }
    }
  },

  /**
   * Remove an object from an array of objects by matching the provided key and value
   *
   * @param {array} array - Array of objects
   * @param {string} key - Key to match the value against
   * @param {string} value - Value to get match of
   */
  removeInstance(array, key, value) {
    let i = array.length;
    while (i--) {
      if (array[i][key] === value) {
        array.splice(i, 1);
        break;
      }
    }

    return array;
  },

  /**
   * _.compact from lodash
   * Remove empty/false items from array
   * Source: https://github.com/lodash/lodash/blob/master/compact.js
   *
   * @param {array} array
   */
  compact(array) {
    let index = -1;
    const length = array == null ? 0 : array.length;
    let resIndex = 0;
    const result = [];

    while (++index < length) {
      const value = array[index];
      if (value) {
        result[resIndex++] = value;
      }
    }
    return result;
  },

  /**
   * _.defaultTo from lodash
   * Checks `value` to determine whether a default value should be returned in
   * its place. The `defaultValue` is returned if `value` is `NaN`, `null`,
   * or `undefined`.
   * Source: https://github.com/lodash/lodash/blob/master/defaultTo.js
   *
   * @param {*} value - Value to check
   * @param {*} defaultValue - Default value
   * @returns {*} - Returns the resolved value
   */
  defaultTo(value, defaultValue) {
    return value == null || value !== value ? defaultValue : value;
  },
};

/**
 * Rich Text Editor
 * -----------------------------------------------------------------------------
 * Wrap videos in div to force responsive layout.
 *
 * @namespace rte
 */

slate.rte = {
  wrapTable() {
    $('.rte table').wrap('<div class="rte__table-wrapper"></div>');
  },

  iframeReset() {
    const $iframeVideo = $(
      '.rte iframe[src*="youtube.com/embed"], .rte iframe[src*="player.vimeo"]'
    );
    const $iframeReset = $iframeVideo.add('.rte iframe#admin_bar_iframe');

    $iframeVideo.each(function() {
      // Add wrapper to make video responsive
      $(this).wrap('<div class="rte__video-wrapper"></div>');
    });

    $iframeReset.each(function() {
      // Re-set the src attribute on each iframe after page load
      // for Chrome's "incorrect iFrame content on 'back'" bug.
      // https://code.google.com/p/chromium/issues/detail?id=395791
      // Need to specifically target video and admin bar
      this.src = this.src;
    });
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
    const instance = slate.utils.findInstance(
      this.instances,
      'id',
      evt.detail.sectionId
    );

    if (!instance) {
      return;
    }

    if (typeof instance.onUnload === 'function') {
      instance.onUnload(evt);
    }

    this.instances = slate.utils.removeInstance(
      this.instances,
      'id',
      evt.detail.sectionId
    );
  },

  _onSelect(evt) {
    const instance = slate.utils.findInstance(
      this.instances,
      'id',
      evt.detail.sectionId
    );

    if (instance && typeof instance.onSelect === 'function') {
      instance.onSelect(evt);
    }
  },

  _onDeselect(evt) {
    const instance = slate.utils.findInstance(
      this.instances,
      'id',
      evt.detail.sectionId
    );

    if (instance && typeof instance.onDeselect === 'function') {
      instance.onDeselect(evt);
    }
  },

  _onReorder(evt) {
    const instance = slate.utils.findInstance(
      this.instances,
      'id',
      evt.detail.sectionId
    );

    if (instance && typeof instance.onReorder === 'function') {
      instance.onReorder(evt);
    }
  },

  _onBlockSelect(evt) {
    const instance = slate.utils.findInstance(
      this.instances,
      'id',
      evt.detail.sectionId
    );

    if (instance && typeof instance.onBlockSelect === 'function') {
      instance.onBlockSelect(evt);
    }
  },

  _onBlockDeselect(evt) {
    const instance = slate.utils.findInstance(
      this.instances,
      'id',
      evt.detail.sectionId
    );

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

/**
 * Currency Helpers
 * -----------------------------------------------------------------------------
 * A collection of useful functions that help with currency formatting
 *
 * Current contents
 * - formatMoney - Takes an amount in cents and returns it as a formatted dollar value.
 *
 */

slate.Currency = (function() {
  const moneyFormat = '${{amount}}';

  /**
   * Format money values based on your shop currency settings
   * @param  {Number|string} cents - value in cents or dollar amount e.g. 300 cents
   * or 3.00 dollars
   * @param  {String} format - shop money_format setting
   * @return {String} value - formatted value
   */
  function formatMoney(cents, format) {
    if (typeof cents === 'string') {
      cents = cents.replace('.', '');
    }
    let value = '';
    const placeholderRegex = /\{\{\s*(\w+)\s*\}\}/;
    const formatString = format || moneyFormat;

    function formatWithDelimiters(number, precision, thousands, decimal) {
      precision = slate.utils.defaultTo(precision, 2);
      thousands = slate.utils.defaultTo(thousands, ',');
      decimal = slate.utils.defaultTo(decimal, '.');

      if (isNaN(number) || number == null) {
        return 0;
      }

      number = (number / 100.0).toFixed(precision);

      const parts = number.split('.');
      const dollarsAmount = parts[0].replace(
        /(\d)(?=(\d\d\d)+(?!\d))/g,
        `$1${thousands}`
      );
      const centsAmount = parts[1] ? decimal + parts[1] : '';

      return dollarsAmount + centsAmount;
    }

    switch (formatString.match(placeholderRegex)[1]) {
      case 'amount':
        value = formatWithDelimiters(cents, 2);
        break;
      case 'amount_no_decimals':
        value = formatWithDelimiters(cents, 0);
        break;
      case 'amount_with_space_separator':
        value = formatWithDelimiters(cents, 2, ' ', '.');
        break;
      case 'amount_with_comma_separator':
        value = formatWithDelimiters(cents, 2, '', ',');
        break;
      case 'amount_no_decimals_with_comma_separator':
        value = formatWithDelimiters(cents, 0, ',', '.');
        break;
      case 'amount_no_decimals_with_space_separator':
        value = formatWithDelimiters(cents, 0, ' ');
        break;
    }

    return formatString.replace(placeholderRegex, value);
  }

  return {
    formatMoney,
  };
})();

/**
 * Image Helper Functions
 * -----------------------------------------------------------------------------
 * A collection of functions that help with basic image operations.
 *
 */

slate.Image = (function() {
  /**
   * Preloads an image in memory and uses the browsers cache to store it until needed.
   *
   * @param {Array} images - A list of image urls
   * @param {String} size - A shopify image size attribute
   */

  function preload(images, size) {
    if (typeof images === 'string') {
      images = [images];
    }

    for (let i = 0; i < images.length; i++) {
      const image = images[i];
      this.loadImage(this.getSizedImageUrl(image, size));
    }
  }

  /**
   * Loads and caches an image in the browsers cache.
   * @param {string} path - An image url
   */
  function loadImage(path) {
    new Image().src = path;
  }

  /**
   * Find the Shopify image attribute size
   *
   * @param {string} src
   * @returns {null}
   */
  function imageSize(src) {
    const match = src.match(
      /.+_((?:pico|icon|thumb|small|compact|medium|large|grande)|\d{1,4}x\d{0,4}|x\d{1,4})[_\.@]/
    );

    if (match) {
      return match[1];
    }
    return null;
  }

  /**
   * Adds a Shopify size attribute to a URL
   *
   * @param src
   * @param size
   * @returns {*}
   */
  function getSizedImageUrl(src, size) {
    if (size === null) {
      return src;
    }

    if (size === 'master') {
      return this.removeProtocol(src);
    }

    const match = src.match(
      /\.(jpg|jpeg|gif|png|bmp|bitmap|tiff|tif)(\?v=\d+)?$/i
    );

    if (match) {
      const prefix = src.split(match[0]);
      const suffix = match[0];

      return this.removeProtocol(`${prefix[0]}_${size}${suffix}`);
    }
    return null;
  }

  function removeProtocol(path) {
    return path.replace(/http(s)?:/, '');
  }

  return {
    preload,
    loadImage,
    imageSize,
    getSizedImageUrl,
    removeProtocol,
  };
})();

/**
 * Variant Selection scripts
 * ------------------------------------------------------------------------------
 *
 * Handles change events from the variant inputs in any `cart/add` forms that may
 * exist. Also updates the master select and triggers updates when the variants
 * price or image changes.
 *
 * @namespace variants
 */

slate.Variants = (function() {
  /**
   * Variant constructor
   *
   * @param {object} options - Settings from `product.js`
   */
  function Variants(options) {
    this.$container = options.$container;
    this.product = options.product;
    this.singleOptionSelector = options.singleOptionSelector;
    this.originalSelectorId = options.originalSelectorId;
    this.enableHistoryState = options.enableHistoryState;
    this.currentVariant = this._getVariantFromOptions();

    $(this.singleOptionSelector, this.$container).on(
      'change',
      this._onSelectChange.bind(this)
    );
  }

  Variants.prototype = $.extend({}, Variants.prototype, {
    /**
     * Get the currently selected options from add-to-cart form. Works with all
     * form input elements.
     *
     * @return {array} options - Values of currently selected variants
     */
    _getCurrentOptions() {
      let currentOptions = $.map(
        $(this.singleOptionSelector, this.$container),
        function(element) {
          const $element = $(element);
          const type = $element.attr('type');
          const currentOption = {};

          if (type === 'radio' || type === 'checkbox') {
            if ($element[0].checked) {
              currentOption.value = $element.val();
              currentOption.index = $element.data('index');

              return currentOption;
            }
            return false;
          }
          currentOption.value = $element.val();
          currentOption.index = $element.data('index');

          return currentOption;
        }
      );

      // remove any unchecked input values if using radio buttons or checkboxes
      currentOptions = slate.utils.compact(currentOptions);

      return currentOptions;
    },

    /**
     * Find variant based on selected values.
     *
     * @param  {array} selectedValues - Values of variant inputs
     * @return {object || undefined} found - Variant object from product.variants
     */
    _getVariantFromOptions() {
      const selectedValues = this._getCurrentOptions();
      const { variants } = this.product;
      let found = false;

      variants.forEach(function(variant) {
        let satisfied = true;

        selectedValues.forEach(function(option) {
          if (satisfied) {
            satisfied = option.value === variant[option.index];
          }
        });

        if (satisfied) {
          found = variant;
        }
      });

      return found || null;
    },

    /**
     * Event handler for when a variant input changes.
     */
    _onSelectChange() {
      const variant = this._getVariantFromOptions();

      this.$container.trigger({
        type: 'variantChange',
        variant,
      });

      if (!variant) {
        return;
      }

      this._updateMasterSelect(variant);
      this._updateImages(variant);
      this._updatePrice(variant);
      this.currentVariant = variant;

      if (this.enableHistoryState) {
        this._updateHistoryState(variant);
      }
    },

    /**
     * Trigger event when variant image changes
     *
     * @param  {object} variant - Currently selected variant
     * @return {event}  variantImageChange
     */
    _updateImages(variant) {
      const variantImage = variant.featured_image || {};
      const currentVariantImage = this.currentVariant.featured_image || {};

      if (
        !variant.featured_image ||
        variantImage.src === currentVariantImage.src
      ) {
        return;
      }

      this.$container.trigger({
        type: 'variantImageChange',
        variant,
      });
    },

    /**
     * Trigger event when variant price changes.
     *
     * @param  {object} variant - Currently selected variant
     * @return {event} variantPriceChange
     */
    _updatePrice(variant) {
      if (
        variant.price === this.currentVariant.price &&
        variant.compare_at_price === this.currentVariant.compare_at_price
      ) {
        return;
      }

      this.$container.trigger({
        type: 'variantPriceChange',
        variant,
      });
    },

    /**
     * Update history state for product deeplinking
     *
     * @param  {variant} variant - Currently selected variant
     * @return {k}         [description]
     */
    _updateHistoryState(variant) {
      if (!history.replaceState || !variant) {
        return;
      }

      const newurl = `${window.location.protocol}//${window.location.host}${
        window.location.pathname
      }?variant=${variant.id}`;
      window.history.replaceState({ path: newurl }, '', newurl);
    },

    /**
     * Update hidden master select of variant change
     *
     * @param  {variant} variant - Currently selected variant
     */
    _updateMasterSelect(variant) {
      $(this.originalSelectorId, this.$container)[0].value = variant.id;
    },
  });

  return Variants;
})();

/*= =============== Sections ================ */
/**
 * Product Template Script
 * ------------------------------------------------------------------------------
 * A file that contains scripts highly couple code to the Product template.
 *
 * @namespace product
 */

theme.Product = (function() {
  const selectors = {
    addToCart: '[data-add-to-cart]',
    addToCartText: '[data-add-to-cart-text]',
    comparePrice: '[data-compare-price]',
    comparePriceText: '[data-compare-text]',
    originalSelectorId: '[data-product-select]',
    priceWrapper: '[data-price-wrapper]',
    productFeaturedImage: '[data-product-featured-image]',
    productJson: '[data-product-json]',
    productPrice: '[data-product-price]',
    productThumbs: '[data-product-single-thumbnail]',
    singleOptionSelector: '[data-single-option-selector]',
  };

  /**
   * Product section constructor. Runs on page load as well as Theme Editor
   * `section:load` events.
   * @param {string} container - selector for the section container DOM element
   */
  function Product(container) {
    this.$container = $(container);
    const sectionId = this.$container.attr('data-section-id');

    this.settings = {};
    this.namespace = '.product';

    // Stop parsing if we don't have the product json script tag when loading
    // section in the Theme Editor
    if (!$(selectors.productJson, this.$container).html()) {
      return;
    }

    this.productSingleObject = JSON.parse(
      $(selectors.productJson, this.$container).html()
    );
    this.settings.imageSize = slate.Image.imageSize(
      $(selectors.productFeaturedImage, this.$container).attr('src')
    );

    $(selectors.productThumbs, this.$container).on(
      'click',
      this.updateProductImageFromThumb.bind(this)
    );

    slate.Image.preload(
      this.productSingleObject.images,
      this.settings.imageSize
    );

    this.initVariants();
  }

  Product.prototype = $.extend({}, Product.prototype, {
    /**
     * Handles change events from the variant inputs
     */
    initVariants() {
      const options = {
        $container: this.$container,
        enableHistoryState:
          this.$container.data('enable-history-state') || false,
        singleOptionSelector: selectors.singleOptionSelector,
        originalSelectorId: selectors.originalSelectorId,
        product: this.productSingleObject,
      };

      this.variants = new slate.Variants(options);

      this.$container.on(
        `variantChange${this.namespace}`,
        this.updateAddToCartState.bind(this)
      );
      this.$container.on(
        `variantImageChange${this.namespace}`,
        this.updateProductImage.bind(this)
      );
      this.$container.on(
        `variantPriceChange${this.namespace}`,
        this.updateProductPrices.bind(this)
      );
    },

    /**
     * Updates the DOM state of the add to cart button
     *
     * @param {boolean} enabled - Decides whether cart is enabled or disabled
     * @param {string} text - Updates the text notification content of the cart
     */
    updateAddToCartState(evt) {
      const { variant } = evt;

      if (variant) {
        $(selectors.priceWrapper, this.$container).removeClass('is-hidden');
      } else {
        $(selectors.addToCart, this.$container).prop('disabled', true);
        $(selectors.addToCartText, this.$container).html(
          theme.strings.unavailable
        );
        $(selectors.priceWrapper, this.$container).addClass('is-hidden');
        return;
      }

      if (variant.available) {
        $(selectors.addToCart, this.$container).prop('disabled', false);
        $(selectors.addToCartText, this.$container).html(
          theme.strings.addToCart
        );
      } else {
        $(selectors.addToCart, this.$container).prop('disabled', true);
        $(selectors.addToCartText, this.$container).html(theme.strings.soldOut);
      }
    },

    /**
     * Updates the DOM with specified prices
     *
     * @param {string} productPrice - The current price of the product
     * @param {string} comparePrice - The original price of the product
     */
    updateProductPrices(evt) {
      const { variant } = evt;
      const $comparePrice = $(selectors.comparePrice, this.$container);
      const $compareEls = $comparePrice.add(
        selectors.comparePriceText,
        this.$container
      );

      $(selectors.productPrice, this.$container).html(
        slate.Currency.formatMoney(variant.price, theme.moneyFormat)
      );

      if (variant.compare_at_price > variant.price) {
        $comparePrice.html(
          slate.Currency.formatMoney(
            variant.compare_at_price,
            theme.moneyFormat
          )
        );
        $compareEls.removeClass('is-hidden');
      } else {
        $comparePrice.html('');
        $compareEls.addClass('is-hidden');
      }
    },

    /**
     * Updates the DOM with the specified image URL
     *
     * @param {string} src - Image src URL
     */
    updateProductImage(evt) {
      const { variant } = evt;
      const sizedImgUrl = slate.Image.getSizedImageUrl(
        variant.featured_image.src,
        this.settings.imageSize
      );

      $(selectors.productFeaturedImage, this.$container).attr(
        'src',
        sizedImgUrl
      );
    },

    /**
     * Updates the DOM with the specified image URL
     *
     * @param {string} src - Image src URL
     */
    updateProductImageFromThumb(evt) {
      evt.preventDefault();
      const imgUrl = $(evt.currentTarget).attr('href');
      $(selectors.productFeaturedImage, this.$container).attr('src', imgUrl);
    },

    /**
     * Event callback for Theme Editor `section:unload` event
     */
    onUnload() {
      this.$container.off(this.namespace);
    },
  });

  return Product;
})();

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
  sections.register('product', theme.Product);
  sections.register('product-tabs', theme.Tabs);
  sections.register('usps-section', theme.Usps);
  sections.register('hero-banner-section', theme.Banner);
  sections.register('logo-slider-section', theme.LogoSlider);
  sections.register('testimonial-section', theme.Testimonials);
  sections.register('image-slider-section', theme.ImageSlider);

  // Common a11y fixes
  slate.a11y.pageLinkFocus($(window.location.hash));

  $('.in-page-link').on('click', function(evt) {
    slate.a11y.pageLinkFocus($(evt.currentTarget.hash));
  });

  // Wrap videos in div to force responsive layout.
  slate.rte.wrapTable();
  slate.rte.iframeReset();

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
