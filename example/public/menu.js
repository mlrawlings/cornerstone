var footerNav = document.querySelector('nav.footer');
var menuLink = document.querySelector('.menu-link');
var isOpen = false;
var timeout = null;

footerNav.classList.add('overlay');
footerNav.classList.add('hidden');
footerNav.style.display = 'none';

menuLink.addEventListener('click', function(e) {
  e.preventDefault();
  if(isOpen) closeMenu();
  else openMenu();
});

footerNav.addEventListener('click', closeMenu);

function openMenu() {
  clearTimeout(timeout);
  footerNav.style.display = '';
  timeout = setTimeout(function() {
    footerNav.classList.remove('hidden');
  }, 20);
  isOpen = true;
  menuLink.classList.add('open');
}

function closeMenu() {
  clearTimeout(timeout);
  footerNav.classList.add('hidden');
  timeout = setTimeout(function() {
    footerNav.style.display = 'none';
  }, 500);
  isOpen = false;
  menuLink.classList.remove('open');
}

window.addEventListener('scroll', function(e) {
  var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
  if(isOpen && scrollTop >= 100) {
    closeMenu();
  }
});