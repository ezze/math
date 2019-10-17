import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import classNames from 'classnames';

@inject('challengeStore') @observer
class PlayFieldImagery extends Component {
  constructor(props) {
    super(props);
    this.onAnswerClick = this.onAnswerClick.bind(this);
  }

  onAnswerClick(event) {
    const { challengeStore } = this.props;
    const { userAnswer } = challengeStore;
    if (typeof userAnswer === 'number') {
      challengeStore.next();
    }
    else {
      const answer = parseInt(event.currentTarget.getAttribute('data-answer'), 10);
      challengeStore.setUserAnswer(answer);
    }
  }

  render() {
    const { challengeStore } = this.props;
    const { correctField, userCorrect, userAnswer, correctAnswer, currentItem } = challengeStore;
    const { url } = currentItem;
    return (
      <div className="play-field-imagery">
        <div className="play-field-imagery-inner">
          <img src={url} />
          <div className="play-field-imagery-mosaic">
            {correctField.map((row, i) => {
              return (
                <div key={i} className="play-field-imagery-mosaic-row">
                  {row.map((visible, j) => {
                    const answer = i * row.length + j + 1;
                    const className = classNames({
                      'play-field-imagery-mosaic-item': true,
                      'play-field-imagery-mosaic-item-visible': visible,
                      'play-field-imagery-mosaic-item-correct': userAnswer && answer === correctAnswer,
                      'play-field-imagery-mosaic-item-wrong': answer === userAnswer && !userCorrect
                    });
                    return (
                      <div key={j} className={className} data-answer={answer} onClick={this.onAnswerClick}>
                        <div className="play-field-imagery-mosaic-answer">{answer}</div>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
}

export default PlayFieldImagery;
