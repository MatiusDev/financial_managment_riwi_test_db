import router from "./router.js";

const App = () => {
  const container = document.createElement('main');
  container.id = 'content';

  router(container);
  
  return container;
}

export default App;