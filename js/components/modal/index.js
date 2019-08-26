// Modules
import $ from 'jquery';

// Core
import theme from '../../core/theme';

function handleOpen(e) {
  e.preventDefault();
  const { html } = theme.cache;
  const target = $(this).data('target');
  $(target).addClass('is-active');
  html.addClass('is-clipped');
}

function handleClose(e) {
  e.preventDefault();
  const { html, modals } = theme.cache;
  html.removeClass('is-clipped');
  modals.removeClass('is-active');
  $('#product-video iframe').attr(
    'src',
    $('#product-video iframe').attr('src')
  );
}

function handleKeyup(e) {
  if (e.keyCode === 27) {
    handleClose();
  }
}

$(document).ready(() => {
  const { modalOpenTriggers, modalCloseTriggers } = theme.cache;
  modalOpenTriggers.on('click', handleOpen);
  modalCloseTriggers.on('click', handleClose);
  $(document).on('keyup', handleKeyup);
});
