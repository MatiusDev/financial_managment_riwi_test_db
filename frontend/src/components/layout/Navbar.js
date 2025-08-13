import './layout.css';

import { clearUserData } from '../../utils/localStorage.js';

const Navbar = () => {
  const nav = document.createElement('nav');
  nav.className = 'navbar is-primary';
  nav.setAttribute('role', 'navigation');
  nav.setAttribute('aria-label', 'main navigation');

  nav.innerHTML = `
    <div class="navbar-brand">
      <a role="button" class="navbar-burger" aria-label="menu" aria-expanded="false" data-target="navbarMenu">
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
      </a>
    </div>
    <div id="navbarMenu" class="navbar-menu">
      <div class="navbar-start">
        <a class="navbar-item" href="#/clients">
          Clientes
        </a>
      </div>
      <div class="navbar-end">
        <div class="navbar-item">
          <div class="buttons">
            <a id="logout-button" class="button is-light">
              Log out
            </a>
          </div>
        </div>
      </div>
    </div>
  `;

  const burger = nav.querySelector('.navbar-burger');
  const menu = nav.querySelector('.navbar-menu');
  burger.addEventListener('click', () => {
    burger.classList.toggle('is-active');
    menu.classList.toggle('is-active');
  });

  const logoutButton = nav.querySelector('#logout-button');
  logoutButton.addEventListener('click', () => {
    clearUserData();
    window.location.hash = '#/';
  });

  return nav;
};

export default Navbar;
