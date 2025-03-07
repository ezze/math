import { observable, action, makeObservable } from 'mobx';

import BaseStore from './BaseStore';

import { modalErrors } from '../constants';

class GeneralStore extends BaseStore {
  @observable soundEnabled = true;
  @observable developerMode = false;
  @observable modal = null;

  constructor(options = {}) {
    super({ key: 'general', ...options });
    makeObservable(this);
  }

  async init() {
    await super.init();
    if (modalErrors.includes(this.modal)) {
      this.modal = null;
    }
  }

  @action setSoundEnabled(soundEnabled) {
    this.soundEnabled = soundEnabled;
  }

  @action setDeveloperMode(developerMode) {
    this.developerMode = developerMode;
  }

  @action setModal(modal) {
    this.modal = modal;
  }
}

export default GeneralStore;
