// Modules
import $ from 'jquery';
import * as Images from '@shopify/theme-images';
import * as Currency from '@shopify/theme-currency';

// Core
import theme from '../../core/theme';

import GenerateVariants from './variant';

/**
 * Product Template Script
 * ------------------------------------------------------------------------------
 * A file that contains scripts highly couple code to the Product template.
 *
 * @namespace product
 */

const GenerateProduct = (function() {
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
    this.settings.imageSize = Images.imageSize(
      $(selectors.productFeaturedImage, this.$container).attr('src')
    );

    $(selectors.productThumbs, this.$container).on(
      'click',
      this.updateProductImageFromThumb.bind(this)
    );

    Images.preload(this.productSingleObject.images, this.settings.imageSize);

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

      this.variants = new GenerateVariants(options);

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
        Currency.formatMoney(variant.price, theme.moneyFormat)
      );

      if (variant.compare_at_price > variant.price) {
        $comparePrice.html(
          Currency.formatMoney(variant.compare_at_price, theme.moneyFormat)
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
      const sizedImgUrl = Images.getSizedImageUrl(
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

export default GenerateProduct;
