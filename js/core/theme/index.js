const { theme = {} } = window;

theme.cache = {
  html: $('html'),
  $body: $('body'),
  recoverPasswordForm: $('#RecoverPassword'),
  hideRecoverPasswordLink: $('#HideRecoverPasswordLink'),
  modals: $('.modal'),
  modalOpenTriggers: $('.modal-trigger'),
  modalCloseTriggers: $(
    '.modal-background, .modal-close, .modal-card-head .delete, .modal-card-foot .button'
  ),
};

export default theme;
