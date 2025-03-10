import { makeObservable, observable } from 'mobx';

import BaseStore from './BaseStore';

import { challengeRecordsCount } from '../constants';

class RecordStore extends BaseStore {
  @observable records = {};

  constructor(options = {}) {
    super({ key: 'record', ...options });
    makeObservable(this);
  }

  add(maxValue, duration, name, score) {
    if (!this.records[`${maxValue}`]) {
      this.records[`${maxValue}`] = {};
    }
    if (!this.records[`${maxValue}`][`${duration}`]) {
      this.records[`${maxValue}`][`${duration}`] = [];
    }
    const records = this.records[`${maxValue}`][`${duration}`];
    const index = records.findIndex(record => record.score < score);
    if (index === -1) {
      if (records.length < challengeRecordsCount) {
        records.push({ name, score });
      }
    }
    else {
      records.splice(index, 0, { name, score });
      if (records.length > challengeRecordsCount) {
        records.splice(challengeRecordsCount, 1);
      }
    }
  }
}

export default RecordStore;
