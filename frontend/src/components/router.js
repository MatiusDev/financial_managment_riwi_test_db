import Authentication from './views/Authentication/Authentication.js';
import Client from './views/Client/Client.js';
import NotFound from './views/NotFound/NotFound.js';

import Navbar from './layout/Navbar.js';
import Section from './layout/Section.js';

import { getUserData } from '../utils/localStorage.js';

const routes = {
  '#/': { sectionId: 'auth', component: Authentication, private: false },
  '#/clients': { sectionId: 'clients', component: Client, private: true },
  '#/notfound': { sectionId: 'notfound', component: NotFound, private: false }
};

const handleRouting = () => {
  const path = window.location.hash || '#/';
  const currentUser = getUserData();

  if (currentUser && path === '#/') {
    window.location.hash = '#/clients';
    return null;
  }

  if (path === '#/login' || path === '#/register') {
    window.location.hash = '#/';
    return null;
  }

  const route = routes[path];

  if (!route) {
    window.location.hash = '#/notfound';
    return null;
  }

  if (route.private && !currentUser) {
    window.location.hash = '#/';
    return null;
  }

  return route;
};

const renderComponent = (content, componentElement, isPrivate, sectionId) => {
  content.innerHTML = '';

  if (isPrivate) {
    content.appendChild(Navbar());
    const section = Section(sectionId, componentElement);
    content.appendChild(section);
  } else {
    const section = Section(sectionId, componentElement);
    content.appendChild(section);
  }
};

const router = async (container) => {
  const route = handleRouting();
  if (!route) {
    return; // Redirection occurred
  }

  const componentResult = route.component();
  const componentElement = (componentResult instanceof Promise)
    ? await componentResult
    : componentResult;

  renderComponent(container, componentElement, route.private, route.sectionId);
};

const onHashChange = () => {
    const content = document.getElementById('content');
    if (content) {
        router(content).catch(error => {
            console.error(error);
            content.innerHTML = '<h1>Error loading page</h1>';
        });
    }
}

window.addEventListener('hashchange', onHashChange);

export default router;
