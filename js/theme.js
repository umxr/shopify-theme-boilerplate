// Modules
import $ from 'jquery';
import 'element-matches';
import * as a11y from '@shopify/theme-a11y';
import * as rte from '@shopify/theme-rte';

// Core
import theme from './core/theme';
import slate from './core/slate';

// Util
import {
  findInstance,
  removeInstance,
  cookiesEnabled,
} from './core/slate/util';
import GenerateProduct from './templates/product';

// Sections
import TabsSection from './sections/tabs';
import UspSection from './sections/usp';
import BannerSection from './sections/banner';
import LogoSliderSection from './sections/logo-slider';
import TestiomialSection from './sections/testimonials';
import ImageSliderSection from './sections/image-slider';

const { Shopify = {} } = window;

/*= =============== Slate ================ */

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

$(document).ready(function() {
  // Run section based JS
  const sections = new slate.Sections();
  sections.register('product', GenerateProduct);
  sections.register('product-tabs', TabsSection);
  sections.register('usps-section', UspSection);
  sections.register('hero-banner-section', BannerSection);
  sections.register('logo-slider-section', LogoSliderSection);
  sections.register('testimonial-section', TestiomialSection);
  sections.register('image-slider-section', ImageSliderSection);

  // Common a11y fixes
  a11y.bindInPageLinks();

  // Wrap videos in div to force responsive layout.
  rte.wrapTable();
  rte.iframeReset();

  // Apply a specific class to the html element for browser support of cookies.
  if (cookiesEnabled) {
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
});
