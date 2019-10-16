import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import classNames from 'classnames';

import './sass/index.sass';

@inject('challengeStore') @observer
class PlayField extends Component {
  state = {
    answer: ''
  };

  constructor(props) {
    super(props);
    this.onKeyDown = this.onKeyDown.bind(this);
  }

  componentDidMount() {
    document.addEventListener('keydown', this.onKeyDown);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.onKeyDown);
  }

  onKeyDown(event) {
    event.preventDefault();

    const { challengeStore } = this.props;
    const { playMode, gameOver, maxValue, userAnswer } = challengeStore;
    const { answer } = this.state;

    if (!playMode || gameOver) {
      return;
    }

    if (event.keyCode === 8) {
      if (answer.length > 0) {
        this.setState({ answer: answer.slice(0, -1) });
      }
      return;
    }

    if ((event.keyCode === 13 || event.keyCode === 27) && typeof userAnswer === 'number') {
      challengeStore.next();
      return;
    }

    if (event.keyCode === 13) {
      if (answer.length === 0) {
        return;
      }
      this.setState({ answer: '' });
      challengeStore.setUserAnswer(parseInt(answer, 10));
      return;
    }

    if (event.keyCode >= 48 && event.keyCode <= 57) {
      if (answer.length < maxValue.toString().length) {
        this.setState({ answer: answer + event.key });
      }
    }
  }

  render() {
    const { challengeStore } = this.props;
    const { playMode, maxValue, operand1, operand2, operator, userAnswer, correctAnswer } = challengeStore;

    const answer = typeof userAnswer === 'number' ? userAnswer.toString() : this.state.answer;
    const correction = typeof userAnswer === 'number' && userAnswer !== correctAnswer ? correctAnswer.toString() : '';
    const spacesCount = 2 * maxValue.toString().length - answer.length - correction.length;

    const answerClassName = classNames({
      'play-field-question-answer': true,
      'play-field-question-answer-correct': typeof userAnswer === 'number' && userAnswer === correctAnswer,
      'play-field-question-answer-wrong': typeof userAnswer === 'number' && userAnswer !== correctAnswer
    });

    return playMode ? (
      <div className="play-field">
        <div className="play-field-question">
          <div className="play-field-question-operand">{operand1}</div>
          <div className="play-field-question-operator">{operator}</div>
          <div className="play-field-question-operand">{operand2}</div>
          <div className="play-field-question-equal">=</div>
          <div className={answerClassName}>
            <span>{answer}</span>
            <span>{correction}</span>
            <span>{new Array(spacesCount + 1).join(' ')}</span>
          </div>
        </div>
      </div>
    ) : '';
  }
}

export default PlayField;
