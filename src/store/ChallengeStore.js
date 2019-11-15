import { observable, computed, action, reaction } from 'mobx';
import { createTransformer } from 'mobx-utils';
import moment from 'moment';

import BaseStore from './BaseStore';

import { delay, random } from '../helpers';
import { playSound } from '../sound';

import {
  challengeDurations,
  challengeFieldParams,
  challengeMaxValues,
  challengeOperators,
  challengeOperatorsIds,
  operators,
  OPERATOR_ADD,
  OPERATOR_SUBTRACT,
  SOUND_TYPE_SUCCESS,
  SOUND_TYPE_ERROR,
  SOUND_TYPE_GAME_OVER
} from '../constants';

import challenges from '../challenges.json';

class ChallengeStore extends BaseStore {
  @observable id = challenges[0].id;
  @observable userName = '';
  @observable duration = challengeDurations[1];
  @observable maxOperand = challengeMaxValues[0];
  @observable maxValue = challengeMaxValues[0];
  @observable operatorsId = 'all';
  @observable playMode = false;
  @observable gameOver = false;
  @observable itemId = null;
  @observable.shallow usedItemIds = [];
  @observable operand1 = null;
  @observable operand2 = null;
  @observable operator = null;
  @observable consecutiveRepeatsCount = 0;
  @observable userAnswer = null;
  @observable innerCount = 0;
  @observable correctCount = 0;
  @observable.shallow correctAnswers = [];

  @observable startTime = null;
  @observable elapsedTime = 0;
  elapsedInterval = null;
  nextTimeout = null;

  @observable loading = false;
  @observable loadingError = false;

  @computed get remainingTimeDisplay() {
    return moment.utc(Math.max((this.duration * 60 - this.elapsedTime) * 1000, 0)).format('mm:ss');
  }

  @computed get challenge() {
    return challenges
      .filter(challenge => challenge.enabled !== false)
      .find(challenge => challenge.id === this.id) || null;
  }

  @computed get name() {
    return this.challenge ? this.challenge.name : '';
  }

  @computed get items() {
    return this.challenge ? this.challenge.items : [];
  }

  @computed get itemIds() {
    return this.items.map(item => item.id);
  }

  @computed get item() {
    return createTransformer(id => {
      return this.items.find(item => item.id === id) || null;
    });
  }

  @computed get currentItem() {
    return this.itemId ? this.item(this.itemId) : null;
  }

  @computed get currentItemName() {
    return this.currentItem ? this.currentItem.name : '';
  }

  @computed get currentItemImagerySize() {
    return challengeFieldParams[`${this.maxValue}`];
  }

  @computed get currentItemCompleted() {
    return this.currentItem ? this.correctAnswers.length === this.maxValue : false;
  }

  @computed get correctField() {
    const { width, height } = this.currentItemImagerySize;
    const field = [];
    for (let i = 1; i <= height; i++) {
      const row = [];
      for (let j = 1; j <= width; j++) {
        const answer = (i - 1) * width + j;
        row.push(this.correctAnswers.includes(answer));
      }
      field.push(row);
    }
    return field;
  }

  @computed get maxOperands() {
    const maxOperands = [];
    for (let i = 1; i <= this.maxValue; i += 1) {
      maxOperands.push(i);
    }
    return maxOperands;
  }

  @computed get operators() {
    return challengeOperators[this.operatorsId] || operators;
  }

  @computed get maxConsecutiveRepeatsCount() {
    return this.maxValue <= 10 ? 2 : 1;
  }

  @computed get correctAnswer() {
    switch (this.operator) {
      case OPERATOR_ADD: {
        return this.operand1 + this.operand2;
      }

      case OPERATOR_SUBTRACT: {
        return this.operand1 - this.operand2;
      }

      default: {
        return null;
      }
    }
  }

  @computed get userCorrect() {
    return this.correctAnswer === this.userAnswer;
  }

  @computed get overallCount() {
    return Math.max(this.innerCount - (typeof this.userAnswer === 'number' ? 0 : 1), 0);
  }

  @computed get score() {
    return 2 * this.correctCount - this.overallCount;
  }

  @action setChallenge(id) {
    this.id = id;
  }

  @action setUserName(userName) {
    this.userName = userName;
  }

  @action setDuration(duration) {
    this.duration = duration;
  }

  @action setMaxValue(maxValue) {
    if (!challengeMaxValues.includes(maxValue)) {
      return;
    }
    this.maxValue = maxValue;
  }

  @action setMaxOperand(maxOperand) {
    if (!this.maxOperands.includes(maxOperand)) {
      return;
    }
    this.maxOperand = maxOperand;
  }

  @action setOperators(operatorsId) {
    if (!challengeOperatorsIds.includes(operatorsId)) {
      return;
    }
    this.operatorsId = operatorsId;
  }

  @action setPlayMode(playMode) {
    this.playMode = playMode;
  }

  @action setUserAnswer(userAnswer) {
    if (typeof this.userAnswer === 'number') {
      return;
    }
    this.userAnswer = userAnswer;
  }

  constructor(options = {}) {
    super({
      key: 'challenge',
      exclude: [
        'playMode',
        'gameOver',
        'itemId',
        'usedItemIds',
        'operand1',
        'operand2',
        'operator',
        'consecutiveRepeatsCount',
        'userAnswer',
        'innerCount',
        'correctCount',
        'correctAnswers',
        'startTime',
        'elapsedTime',
        'loading',
        'loadingError'
      ],
      ...options
    });

    const { generalStore, recordStore } = options;
    this.generalStore = generalStore;
    this.recordStore = recordStore;

    this.disposeId = reaction(() => this.id, () => {
      const { playMode } = this;
      this.stop();
      this.loadItems().then(() => {
        if (playMode) {
          return this.start();
        }
      }).catch(e => console.error(e));
    });

    this.disposePlayMode = reaction(() => this.playMode, playMode => {
      if (playMode) {
        this.start().catch(e => console.error(e));
      }
      else {
        this.stop();
      }
    });

    this.disposeDuration = reaction(() => this.duration, () => {
      if (this.playMode) {
        this.start().catch(e => console.error(e));
      }
    });

    this.disposeMaxValue = reaction(() => this.maxValue, maxValue => {
      this.maxOperand = maxValue;
      if (this.playMode) {
        this.start().catch(e => console.error(e));
      }
    });

    this.disposeMaxOperandAndOperators = reaction(() => ({
      maxOperand: this.maxOperand,
      operators: this.operators
    }), () => {
      if (this.playMode) {
        this.start().catch(e => console.error(e));
      }
    });

    this.disposeUserAnswer = reaction(() => this.userAnswer, userAnswer => {
      if (!this.playMode || typeof userAnswer !== 'number') {
        return;
      }
      this.check();
    });

    this.disposeGameOver = reaction(() => this.gameOver, gameOver => {
      if (gameOver) {
        if (this.generalStore.soundEnabled) {
          playSound(SOUND_TYPE_GAME_OVER).catch(e => console.error(e));
        }
        const { score } = this;
        if (score > 0) {
          this.recordStore.add(this.maxValue, this.duration, this.userName, score);
        }
      }

      if (this.playMode && !gameOver) {
        this.playMode = false;
      }
    });

    this.loadItems().catch(e => console.error(e));
  }

  async destroy() {
    this.disposeId();
    this.disposePlayMode();
    this.disposeDuration();
    this.disposeMaxValue();
    this.disposeMaxOperandAndOperators();
    this.disposeUserAnswer();
    this.disposeGameOver();
    super.destroy();
  }

  reset() {
    this.gameOver = false;
    this.itemId = null;
    this.usedItemIds = [];
    this.operand1 = null;
    this.operand2 = null;
    this.operator = null;
    this.consecutiveRepeatsCount = 0;
    this.userAnswer = null;
    this.innerCount = 0;
    this.correctCount = 0;
    this.correctAnswers = [];

    this.startTime = null;
    this.elapsedTime = 0;
    if (this.elapsedInterval) {
      clearInterval(this.elapsedInterval);
      this.elapsedInterval = null;
    }
  }

  async loadItems() {
    while (this.loading) {
      await delay();
    }

    try {
      this.loading = true;
      this.loadingError = false;
      await Promise.all(this.items.map(item => {
        const { url } = item;
        return new Promise((resolve, reject) => {
          const image = new Image();
          image.onload = resolve;
          image.onerror = reject;
          image.src = url;
        });
      }));
      await delay();
      this.loadingError = false;
    }
    catch (e) {
      this.loadingError = true;
    }
    finally {
      this.loading = false;
    }
  }

  async start() {
    while (this.loading) {
      await delay();
    }

    if (!this.challenge) {
      this.playMode = false;
      return;
    }

    this.reset();

    this.startTime = moment().unix();
    this.elapsedInterval = setInterval(() => {
      this.elapsedTime = moment().unix() - this.startTime;
      if (this.elapsedTime > this.duration * 60) {
        clearInterval(this.elapsedInterval);
        this.gameOver = true;
      }
    }, 100);

    this.next();
  }

  stop() {
    this.reset();
  }

  next() {
    this.userAnswer = null;

    if (this.nextTimeout) {
      clearTimeout(this.nextTimeout);
      this.nextTimeout = null;
    }

    if (!this.itemId || this.currentItemCompleted) {
      const previousItemId = this.itemId;
      if (this.usedItemIds.length === this.itemIds.length) {
        this.usedItemIds = [];
      }
      let id;
      do {
        const index = random(0, this.itemIds.length - 1);
        id = this.itemIds[index];
      }
      while (this.usedItemIds.includes(id) || (id === previousItemId && this.itemIds.length > 1));
      this.itemId = id;
      this.correctAnswers = [];
    }

    this.operator = this.operators[random(0, this.operators.length - 1)];

    let operands;
    switch (this.operator) {
      case OPERATOR_ADD: {
        operands = () => {
          const operand1 = random(0, this.maxOperand);
          const operand2 = random(0, this.maxValue - operand1);
          return Math.random() < 0.5 ? { operand1, operand2 } : { operand1: operand2, operand2: operand1 };
        };
        break;
      }

      case OPERATOR_SUBTRACT: {
        operands = () => {
          const operand1 = random(0, this.maxValue);
          const operand2 = random(0, Math.min(this.maxOperand, operand1));
          return { operand1, operand2 };
        };
      }
    }

    do {
      const { operand1, operand2 } = operands();
      this.operand1 = operand1;
      this.operand2 = operand2;
    }
    while (
      this.consecutiveRepeatsCount >= this.maxConsecutiveRepeatsCount &&
      (this.correctAnswers.includes(this.correctAnswer) || this.correctAnswer === 0)
    );

    if (this.correctAnswers.includes(this.correctAnswer) || this.correctAnswer === 0) {
      this.consecutiveRepeatsCount++;
    }
    else {
      this.consecutiveRepeatsCount = 0;
    }

    this.innerCount++;
  }

  check() {
    if (this.generalStore.soundEnabled) {
      playSound(this.userCorrect ? SOUND_TYPE_SUCCESS : SOUND_TYPE_ERROR).catch(e => console.error(e));
    }

    if (this.userCorrect) {
      this.correctCount++;
      if (this.correctAnswer > 0 && !this.correctAnswers.includes(this.correctAnswer)) {
        this.correctAnswers.push(this.correctAnswer);
      }
    }
    else if (this.correctAnswers.length > 0) {
      const removeIndex = random(0, this.correctAnswers.length - 1);
      this.correctAnswers.splice(removeIndex, 1);
    }

    this.nextTimeout = setTimeout(() => this.next(), this.currentItemCompleted ? 10000 : 1500);
  }
}

export default ChallengeStore;
