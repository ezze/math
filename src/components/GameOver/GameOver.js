import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';

import ModalNotification from '../ModalNotification';

import { MODAL_HALL_OF_FAME } from '../../constants';

@inject('generalStore', 'challengeStore') @observer
class GameOver extends Component {
  constructor(props) {
    super(props);
    this.onHallOfFameClick = this.onHallOfFameClick.bind(this);
    this.close = this.close.bind(this);
  }

  onHallOfFameClick() {
    this.close();
    this.props.generalStore.setModal(MODAL_HALL_OF_FAME);
  }

  close() {
    const { challengeStore } = this.props;
    challengeStore.gameOver = false;
  }

  render() {
    const { challengeStore } = this.props;
    const { gameOver, correctCount, overallCount, score } = challengeStore;
    return (
      <ModalNotification style="warning" visible={gameOver} close={this.close}>
        <h1 className="title is-4">Игра окончена</h1>
        <p><b>Количество очков: {score}</b></p>
        <p>Количество примеров: {overallCount}</p>
        <p>Количество правильных ответов: {correctCount}</p>
        <p>Количество неправильных ответов: {overallCount - correctCount}</p>
        <p>&nbsp;</p>
        <div className="has-text-centered">
          <button className="button" onClick={this.onHallOfFameClick}>Таблица рекордов</button>
        </div>
      </ModalNotification>
    );
  }
}

export default GameOver;
