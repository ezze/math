import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';

import './sass/index.sass';

@inject('challengeStore') @observer
class State extends Component {
  render() {
    const { challengeStore } = this.props;
    const { playMode, remainingTimeDisplay, correctCount, overallCount, score } = challengeStore;
    return playMode ? (
      <div className="state">
        <div>{remainingTimeDisplay}</div>
        <div>
          <span className="state-score">{score}</span> <span>({correctCount}/{overallCount})</span>
        </div>
      </div>
    ) : '';
  }
}

export default State;
