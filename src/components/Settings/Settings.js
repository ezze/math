import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import classNames from 'classnames';

import challenges from '../../challenges.json';

import {
  challengeDurations,
  MODAL_SETTINGS
} from '../../constants';

@inject('generalStore', 'challengeStore') @observer
class Settings extends Component {
  constructor(props) {
    super(props);
    this.onChallengeChange = this.onChallengeChange.bind(this);
    this.onDurationChange = this.onDurationChange.bind(this);
    this.onSoundEnabledChange = this.onSoundEnabledChange.bind(this);
    this.onCloseClick = this.onCloseClick.bind(this);
  }

  onChallengeChange(event) {
    const { challengeStore } = this.props;
    challengeStore.setChallenge(event.target.value);
  }

  onDurationChange(event) {
    const { challengeStore } = this.props;
    challengeStore.setDuration(event.target.value);
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
    const { t, generalStore, challengeStore } = this.props;
    const { soundEnabled, developerMode, modal } = generalStore;
    const { id: challengeId, duration, loading } = challengeStore;

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
                <label className="checkbox">
                  <input type="checkbox" checked={soundEnabled} onChange={this.onSoundEnabledChange} />
                  <span>Включить звук</span>
                </label>
              </div>
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

export default Settings;
