import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import classNames from 'classnames';

import challenges from '../../challenges.json';

import {
  challengeDurations,
  challengeMaxValues,
  challengeOperatorsIds,
  MODAL_SETTINGS
} from '../../constants';

@inject('generalStore', 'challengeStore') @observer
class Settings extends Component {
  constructor(props) {
    super(props);
    this.onChallengeChange = this.onChallengeChange.bind(this);
    this.onDurationChange = this.onDurationChange.bind(this);
    this.onMaxValueChange = this.onMaxValueChange.bind(this);
    this.onMaxOperandChange = this.onMaxOperandChange.bind(this);
    this.onOperatorsIdChange = this.onOperatorsIdChange.bind(this);
    this.onSoundEnabledChange = this.onSoundEnabledChange.bind(this);
    this.onCloseClick = this.onCloseClick.bind(this);
  }

  onChallengeChange(event) {
    const { challengeStore } = this.props;
    challengeStore.setChallenge(event.target.value);
  }

  onDurationChange(event) {
    const { challengeStore } = this.props;
    challengeStore.setDuration(parseInt(event.target.value, 10));
  }

  onMaxValueChange(event) {
    const { challengeStore } = this.props;
    challengeStore.setMaxValue(parseInt(event.target.value, 10));
  }

  onMaxOperandChange(event) {
    const { challengeStore } = this.props;
    challengeStore.setMaxOperand(parseInt(event.target.value, 10));
  }

  onOperatorsIdChange(event) {
    const { challengeStore } = this.props;
    challengeStore.setOperators(event.target.value);
  }

  onSoundEnabledChange(event) {
    const { generalStore } = this.props;
    generalStore.setSoundEnabled(event.target.checked);
  }

  onCloseClick() {
    const { generalStore } = this.props;
    generalStore.setModal(null);
  }

  render() {
    const { generalStore, challengeStore } = this.props;
    const { soundEnabled, developerMode, modal } = generalStore;
    const {
      id: challengeId,
      duration,
      maxValue,
      maxOperand,
      maxOperands,
      operatorsId,
      loading
    } = challengeStore;

    const className = classNames({
      modal: true,
      'is-active': modal === MODAL_SETTINGS
    });

    const challengeSelectClassName = classNames({
      select: true,
      'is-fullwidth': true,
      'is-loading': loading
    });

    return (
      <div className={className}>
        <div className="modal-background"></div>
        <div className="modal-content">
          <div className="panel">
            <p className="panel-heading">Настройки</p>
            <div className="panel-block">
              <div className="field">
                <label className="label">Тематика</label>
                <div className="control">
                  <div className={challengeSelectClassName}>
                    <select value={challengeId} disabled={loading} onChange={this.onChallengeChange}>
                      {challenges.filter(challenge => challenge.enabled !== false).map(challenge => (
                        <option key={challenge.id} value={challenge.id}>
                          {challenge.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              <div className="field">
                <label className="label">Продолжительность игры (в минутах)</label>
                <div className="control">
                  <div className="select is-fullwidth">
                    <select value={duration} onChange={this.onDurationChange}>
                      {challengeDurations.concat(developerMode ? [0.1] : []).map(duration => (
                        <option key={duration} value={duration}>
                          {duration}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              <div className="field">
                <label className="label">Максимальное значение</label>
                <div className="control">
                  <div className="select is-fullwidth">
                    <select value={maxValue} onChange={this.onMaxValueChange}>
                      {challengeMaxValues.map(maxValue => (
                        <option key={maxValue} value={maxValue}>
                          {maxValue}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              <div className="field">
                <label className="label">Максимальное значение одного из операндов</label>
                <div className="control">
                  <div className="select is-fullwidth">
                    <select value={maxOperand} onChange={this.onMaxOperandChange}>
                      {maxOperands.map(maxOperand => (
                        <option key={maxOperand} value={maxOperand}>
                          {maxOperand}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              <div className="field">
                <label className="label">Арифметические операции</label>
                <div className="control">
                  <div className="select is-fullwidth">
                    <select value={operatorsId} onChange={this.onOperatorsIdChange}>
                      {challengeOperatorsIds.map(operatorsId => {
                        const label = getOperatorsLabel(operatorsId);
                        return (
                          <option key={operatorsId} value={operatorsId}>
                            {label}
                          </option>
                        );
                      })}
                    ))}
                    </select>
                  </div>
                </div>
              </div>
              <div className="field">
                <label className="checkbox">
                  <input type="checkbox" checked={soundEnabled} onChange={this.onSoundEnabledChange} />
                  <span>Включить звук</span>
                </label>
              </div>
            </div>
            <div className="panel-block">
              <div className="buttons is-right">
                <button className="button is-primary" onClick={this.onCloseClick}>Закрыть</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function getOperatorsLabel(operatorsId) {
  switch (operatorsId) {
    case 'addOnly': return 'Только сложение';
    case 'subtractOnly': return 'Только вычитание';
    case 'all': return 'Все';
  }
  return operatorsId;
}

export default Settings;
