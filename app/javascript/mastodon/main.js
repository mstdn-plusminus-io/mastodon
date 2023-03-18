import React from 'react';
import ReactDOM from 'react-dom';
import { setupBrowserNotifications } from 'mastodon/actions/notifications';
import Mastodon, { store } from 'mastodon/containers/mastodon';
import { me } from 'mastodon/initial_state';
import ready from 'mastodon/ready';

const perf = require('mastodon/performance');

/**
 * @returns {Promise<void>}
 */
function main() {
  perf.start('main()');

  return ready(async () => {
    const mountNode = document.getElementById('mastodon');
    const props = JSON.parse(mountNode.getAttribute('data-props'));

    window.__PLUS_MINUS_EVENTS__ = new EventTarget();

    if (localStorage.plusminus_config_sp_header === 'hidden') {
      document.body.classList.add('hide-sp-header');
    }

    ReactDOM.render(<Mastodon {...props} />, mountNode);
    store.dispatch(setupBrowserNotifications());

    if (process.env.NODE_ENV === 'production' && me && 'serviceWorker' in navigator) {
      const { Workbox } = await import('workbox-window');

      let workerPath = '/sw.js';
      if (document.querySelector('meta[name="plusminus-disable-remote-media-cache"]')?.getAttribute('content') === 'true') {
        workerPath += '?disable-remote-media-cache=true';
      }

      const wb = new Workbox(workerPath);
      /** @type {ServiceWorkerRegistration} */
      let registration;

      try {
        registration = await wb.register();
      } catch (err) {
        console.error(err);
      }

      if (registration) {
        const registerPushNotifications = await import('mastodon/actions/push_notifications');

        store.dispatch(registerPushNotifications.register());
      }
    }

    perf.stop('main()');
  });
}

export default main;
