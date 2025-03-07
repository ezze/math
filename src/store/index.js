import { when } from 'mobx';

import GeneralStore from './GeneralStore';
import ChallengeStore from './ChallengeStore';
import RecordStore from './RecordStore';

export const stores = {};

export async function createStores() {
  const generalStore = stores.generalStore = new GeneralStore();
  await generalStore.init();

  const recordStore = stores.recordStore = new RecordStore();
  await recordStore.init();

  await when(() => generalStore.storeInitialized && recordStore.storeInitialized);

  const challengeStore = stores.challengeStore = new ChallengeStore({ generalStore, recordStore });
  await challengeStore.init();

  await when(() => challengeStore.storeInitialized);

  return Promise.resolve(stores);
}
