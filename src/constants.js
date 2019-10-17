// Sounds
export const SOUND_TYPE_SUCCESS = 'SOUND_TYPE_SUCCESS';
export const SOUND_TYPE_ERROR = 'SOUND_TYPE_ERROR';
export const SOUND_TYPE_GAME_OVER = 'SOUND_TYPE_GAME_OVER';

export const soundTypes = [
  SOUND_TYPE_SUCCESS,
  SOUND_TYPE_ERROR,
  SOUND_TYPE_GAME_OVER
];

// Modal
export const MODAL_USER_NAME = 'MODAL_USER_NAME';
export const MODAL_SETTINGS = 'MODAL_SETTINGS';
export const MODAL_HALL_OF_FAME = 'MODAL_HALL_OF_FAME';
export const MODAL_AUDIO_NOTIFICATION = 'MODAL_AUDIO_NOTIFICATION';
export const MODAL_ABOUT = 'MODAL_ABOUT';
export const modalErrors = [];

// Challenge
export const OPERATOR_ADD = '+';
export const OPERATOR_SUBTRACT = '-';
export const operators = [
  OPERATOR_ADD,
  OPERATOR_SUBTRACT
];

export const challengeOperators = {
  addOnly: [OPERATOR_ADD],
  subtractOnly: [OPERATOR_SUBTRACT],
  all: [OPERATOR_ADD, OPERATOR_SUBTRACT]
};
export const challengeOperatorsIds = Object.keys(challengeOperators);

export const challengeRecordsCount = 10;
export const challengeDurations = [3, 5, 7, 10, 15];
export const challengeFieldParams = {
  10: { width: 5, height: 2 },
  20: { width: 5, height: 4 },
  30: { width: 6, height: 5 },
  40: { width: 8, height: 5 },
  50: { width: 10, height: 5 },
  100: { width: 10, height: 10 }
};
export const challengeMaxValues = Object.keys(challengeFieldParams).map(maxValue => parseInt(maxValue, 10));
