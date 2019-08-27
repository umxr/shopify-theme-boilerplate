function toggleNav() {
  const target = $(this).data('target');
  $(this).toggleClass('is-active');
  $(target).toggleClass('is-active');
}

$(document).ready(() => {
  const navBurger = $('.navbar-burger');
  if (navBurger.length > 0) {
    navBurger.on('click', toggleNav);
  }
});
