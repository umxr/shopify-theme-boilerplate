import theme from '../../core/theme';

/**
 * Password Template Script
 * ------------------------------------------------------------------------------
 * A file that contains scripts highly couple code to the Password template.
 *
 * @namespace password
 */

$(document).ready(() => {
  const { passwordForm, passwordLink } = theme.cache;
  if (passwordForm.length) {
    passwordLink.on('click', function(e) {
      e.preventDefault();
      passwordForm.toggleClass('is-hidden');
    });
  }
});
