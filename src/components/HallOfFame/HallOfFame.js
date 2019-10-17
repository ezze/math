import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';

import ModalNotification from '../ModalNotification';

import { MODAL_HALL_OF_FAME } from '../../constants';

import './sass/index.sass';

@inject('generalStore', 'challengeStore', 'recordStore') @observer
class HallOfFame extends Component {
  constructor(props) {
    super(props);
    this.close = this.close.bind(this);
  }

  close() {
    const { generalStore } = this.props;
    generalStore.setModal(null);
  }

  getRecords() {
    const { challengeStore, recordStore } = this.props;
    const { maxValue, duration } = challengeStore;
    const { records } = recordStore;
    if (!records[`${maxValue}`] || !records[`${maxValue}`][`${duration}`]) {
      return [];
    }
    return records[`${maxValue}`][`${duration}`];
  }

  render() {
    const { generalStore, challengeStore } = this.props;
    const { modal } = generalStore;
    const { duration } = challengeStore;
    const records = this.getRecords();
    const table = records.length > 0 ? (
      <table className="hall-of-fame-table">
        <tbody>
          {records.map((record, i) => (
            <tr key={i}>
              <td className="hall-of-fame-table-place">{i + 1}</td>
              <td className="hall-of-fame-table-name">{record.name}</td>
              <td className="hall-of-fame-table-score">{record.score}</td>
            </tr>
          ))}
        </tbody>
      </table>
    ) : (
      <div className="hall-of-fame-table has-text-centered">Результатов пока нет.</div>
    );
    return (
      <ModalNotification title="Таблица рекордов" visible={modal === MODAL_HALL_OF_FAME} close={this.close}>
        <div className="notification is-warning">
          <p>Максимальное значение: {maxValue}</p>
          <p>Продолжительность (в минутах): {duration}</p>
        </div>
        {table}
      </ModalNotification>
    );
  }
}

export default HallOfFame;
