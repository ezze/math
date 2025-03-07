import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import classNames from 'classnames';

import {
  MODAL_SETTINGS,
  MODAL_USER_NAME,
  MODAL_HALL_OF_FAME,
  MODAL_ABOUT
} from '../../constants';

import challenges from '../../challenges.json';
import yellowberryImgUrl from '../../yellowberry.png';

import './sass/index.sass';

@inject('generalStore', 'challengeStore') @observer
class Toolbar extends Component {
  burgerRef = React.createRef();
  menuRef = React.createRef();

  constructor(props) {
    super(props);
    this.onEditUserNameClick = this.onEditUserNameClick.bind(this);
    this.onChallengeChange = this.onChallengeChange.bind(this);
    this.onPlayModeClick = this.onPlayModeClick.bind(this);
    this.onSettingsClick = this.onSettingsClick.bind(this);
    this.onHallOfFameClick = this.onHallOfFameClick.bind(this);
    this.onAboutClick = this.onAboutClick.bind(this);
    this.onBurgerClick = this.onBurgerClick.bind(this);
  }

  onEditUserNameClick() {
    const { generalStore } = this.props;
    generalStore.setModal(MODAL_USER_NAME);
  }

  onChallengeChange() {
    const { challengeStore } = this.props;
    challengeStore.setChallenge(event.target.value);
  }

  onPlayModeClick() {
    const { challengeStore } = this.props;
    challengeStore.setPlayMode(!challengeStore.playMode);
  }

  onSettingsClick() {
    const { generalStore } = this.props;
    generalStore.setModal(MODAL_SETTINGS);
  }

  onHallOfFameClick() {
    const { generalStore } = this.props;
    generalStore.setModal(MODAL_HALL_OF_FAME);
  }

  onAboutClick() {
    const { generalStore } = this.props;
    generalStore.setModal(MODAL_ABOUT);
  }

  onBurgerClick() {
    this.burgerRef.current.classList.toggle('is-active');
    this.menuRef.current.classList.toggle('is-active');
  }

  render() {
    const { challengeStore } = this.props;
    const { id, userName, playMode, loading } = challengeStore;

    const playModeButtonClassName = classNames({
      button: true,
      'is-primary': !playMode,
      'is-danger': playMode,
      'is-small': true
    });

    const challengeSelectClassName = classNames({
      select: true,
      'is-fullwidth': true,
      'is-small': true,
      'is-loading': loading
    });

    return (
      <nav className="toolbar navbar is-fixed-top" role="navigation" aria-label="main navigation">
        <div className="navbar-brand">
          <a className="navbar-item" href="">
            <img src={yellowberryImgUrl} />&nbsp;<span>Арифметика</span>
          </a>
          <a
            ref={this.burgerRef}
            role="button"
            className="navbar-burger burger"
            aria-label="menu"
            aria-expanded="false"
            onClick={this.onBurgerClick}
          >
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
          </a>
        </div>

        <div ref={this.menuRef} className="navbar-menu">
          <div className="navbar-start">
            <div className="navbar-item">
              <div className="field is-grouped">
                <div className="control">
                  <div className="field has-addons">
                    <div className="control">
                      <input className="toolbar-user-name input is-small" disabled={true} value={userName} />
                    </div>
                    <div className="control">
                      <button
                        className="button is-primary is-small"
                        title="Изменить имя пользователя"
                        onClick={this.onEditUserNameClick}
                      >
                        <span className="icon">
                          <i className="fa-solid fa-edit" />
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
                <div className="control">
                  <div className="field has-addons">
                    <div className="control toolbar-challenge">
                      <div className={challengeSelectClassName}>
                        <select value={id} disabled={loading} onChange={this.onChallengeChange}>
                          {challenges.filter(challenge => challenge.enabled !== false).map(challenge => (
                            <option key={challenge.id} value={challenge.id}>
                              {challenge.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="control">
                      <button
                        className={playModeButtonClassName}
                        onClick={this.onPlayModeClick}
                        title={playMode ? 'Остановить' : 'Начать'}
                      >
                        <span className="icon">
                          <i className={`fa-solid fa-${playMode ? 'stop' : 'play'}`} />
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="navbar-end">
            <div className="navbar-item">
              <div className="buttons">
                <button className="button is-warning is-small" onClick={this.onAboutClick}>
                  <span className="icon">
                    <i className="fa-solid fa-question" />
                  </span>
                  <span>О приложении</span>
                </button>
                <button className="button is-warning is-small" onClick={this.onHallOfFameClick}>
                  <span className="icon">
                    <i className="fa-solid fa-list" />
                  </span>
                  <span>Рекорды</span>
                </button>
                <button className="button is-warning is-white is-small" onClick={this.onSettingsClick}>
                  <span className="icon">
                    <i className="fa-solid fa-gear" />
                  </span>
                  <span>Настройки</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>
    );
  }
}

export default Toolbar;
