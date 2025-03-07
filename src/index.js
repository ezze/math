import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'mobx-react';

import './sass/index.sass';

import { createStores } from './store';
import { initSounds } from './sound';

import App from './components/App';

document.addEventListener('DOMContentLoaded', async() => {
  console.log('here');
  const stores = await createStores();
  console.log(1);
  await initSounds();
  console.log(2);
  const content = (
    <Provider {...stores}>
      <App />
    </Provider>
  );
  console.log(3);
  render(content, document.querySelector('.app-container'));
});
