import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'mobx-react';

import './sass/index.sass';

import { createStores } from './store';
import { initSounds } from './sound';

import App from './components/App';

document.addEventListener('DOMContentLoaded', async() => {
  const stores = await createStores();
  await initSounds();
  const content = (
    <Provider {...stores}>
      <App />
    </Provider>
  );
  render(content, document.querySelector('.app-container'));
});
