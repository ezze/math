import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import classNames from 'classnames';
import ReactLoading from 'react-loading';

@inject('challengeStore') @observer
class PlayFieldImagery extends Component {
  state = {
    loading: false,
    width: null,
    height: null,
    ratio: null,
    containerWidth: 0,
    containerHeight: 0
  };

  ref = React.createRef();

  constructor(props) {
    super(props);
    this.onWindowResize = this.onWindowResize.bind(this);
    this.onAnswerClick = this.onAnswerClick.bind(this);
  }

  componentDidMount() {
    window.addEventListener('resize', this.onWindowResize);
    this.updateContainerState();
    this.preloadImage().catch(e => console.error(e));
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onWindowResize);
  }

  updateContainerState() {
    const { clientWidth: containerWidth, clientHeight: containerHeight } = this.ref.current;
    this.setState({ containerWidth, containerHeight });
  }

  async preloadImage() {
    const { challengeStore } = this.props;
    const { currentItem } = challengeStore;
    if (!currentItem) {
      return;
    }
    const { url } = currentItem;
    this.setState({ loading: true });
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = reject;
      image.src = url;
    }).then(image => {
      const { width, height } = image;
      const ratio = width / height;
      this.setState({ loaded: true, width, height, ratio });
    }).finally(() => {
      this.setState({ loading: false });
    });
  }

  onWindowResize() {
    this.updateContainerState();
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
    let content = '';

    const { challengeStore } = this.props;
    const { currentItem } = challengeStore;
    const { loading } = this.state;

    if (loading) {
      content = (
        <ReactLoading class="play-field-imagery-loading" type="spin" />
      );
    }
    else if (currentItem) {
      const { url } = currentItem;
      const { ratio, containerHeight } = this.state;

      const {
        maxValue,
        correctField,
        userCorrect,
        userAnswer,
        correctAnswer,
        currentItemCompleted
      } = challengeStore;

      const mosaicClassName = classNames({
        'play-field-imagery-mosaic': true,
        [`play-field-imagery-mosaic-max-value-${maxValue}`]: true
      });

      content = (
        <div className="play-field-imagery-container" style={{
          width: `${containerHeight * ratio}px`
        }}>
          <img src={url} />
          <div className={mosaicClassName}>
            {correctField.map((row, i) => {
              return (
                <div key={i} className="play-field-imagery-mosaic-row">
                  {row.map((visible, j) => {
                    const answer = i * row.length + j + 1;
                    const className = classNames({
                      'play-field-imagery-mosaic-item': true,
                      'play-field-imagery-mosaic-item-visible': visible,
                      'play-field-imagery-mosaic-item-correct': (
                        !currentItemCompleted && userAnswer && answer === correctAnswer
                      ),
                      'play-field-imagery-mosaic-item-wrong': (
                        !currentItemCompleted && answer === userAnswer && !userCorrect)
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
      );
    }
    else {
      content = (
        <div className="play-field-imagery-error">Что-то пошло не так!</div>
      );
    }

    return (
      <div className="play-field-imagery" ref={this.ref}>
        {content}
      </div>
    );
  }
}

export default PlayFieldImagery;
