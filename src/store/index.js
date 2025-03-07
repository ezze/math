import { reaction, when } from 'mobx';

import GeneralStore from './GeneralStore';
import ChallengeStore from './ChallengeStore';
import RecordStore from './RecordStore';

export const stores = {};

export async function createStores() {
  const generalStore = stores.generalStore = new GeneralStore();
  const recordStore = stores.recordStore = new RecordStore();
  
  await when(() => generalStore.storeInitialized);

  stores.challengeStore = new ChallengeStore({ generalStore, recordStore });

  const storeNames = Object.keys(stores);

  return new Promise(resolve => {
    const disposeStoreInit = reaction(() => storeNames.map(storeName => {
      return stores[storeName].storeInitialized;
    }), storeInits => {
      for (let i = 0; i < storeInits.length; i++) {
        if (!storeInits[i]) {
          return;
        }
      }
      disposeStoreInit();
      resolve(stores);
    });
  });
}
