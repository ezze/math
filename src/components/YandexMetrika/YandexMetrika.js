import React, { Component } from 'react';

const mode = NODE_ENV; // eslint-disable-line no-undef

class YandexMetrika extends Component {
  componentDidMount() {
    if (mode === 'production') {
      (function(m, e, t, r, i, k, a) {
        m[i] = m[i] || function() {
          (m[i].a = m[i].a || []).push(arguments);
        };
        m[i].l = 1 * new Date();
        k = e.createElement(t);
        a = e.getElementsByTagName(t)[0];
        k.async = 1;
        k.src = r;
        a.parentNode.insertBefore(k, a);
      })(window, document, 'script', 'https://mc.yandex.ru/metrika/tag.js', 'ym');

      ym(55840108, 'init', { // eslint-disable-line no-undef
        clickmap: true,
        trackLinks: true,
        accurateTrackBounce: true,
        webvisor: true
      });
    }
  }

  render() {
    return mode === 'production' ? (
      <noscript>
        <div>
          <img src="https://mc.yandex.ru/watch/55840108" style="position:absolute; left:-9999px;" alt="" />
        </div>
      </noscript>
    ) : '';
  }
}

export default YandexMetrika;
