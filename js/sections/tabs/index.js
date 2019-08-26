import $ from 'jquery';

const TabsSection = (function() {
  const selectors = {
    tabs: '.tabs',
  };

  function Tabs(container) {
    this.$container = $(container);
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
      const $block = $(event.target);
      $block.trigger('click');
    },
  });

  return Tabs;
})();

export default TabsSection;
