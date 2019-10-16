import {
  SOUND_TYPE_SUCCESS,
  SOUND_TYPE_ERROR,
  SOUND_TYPE_GAME_OVER,
  soundTypes
} from '../constants';

import successSoundUrl from './success.mp3';
import errorSoundUrl from './error.mp3';
import gameOverSoundUrl from './game-over.mp3';

const sounds = {};
const playingSounds = {};

export async function initSounds() {
  if (!Audio) {
    return;
  }

  for (let i = 0; i < soundTypes.length; i++) {
    const type = soundTypes[i];
    let url;
    switch (type) {
      case SOUND_TYPE_SUCCESS: url = successSoundUrl; break;
      case SOUND_TYPE_ERROR: url = errorSoundUrl; break;
      case SOUND_TYPE_GAME_OVER: url = gameOverSoundUrl; break;
    }
    if (!url) {
      continue;
    }

    await new Promise((resolve, reject) => {
      const sound = new Audio();
      const onCanPlay = () => {
        removeListeners();
        sounds[type] = sound;
        resolve();
      };
      const onError = () => {
        removeListeners();
        reject();
      };
      const removeListeners = () => {
        sound.removeEventListener('canplaythrough', onCanPlay);
        sound.removeEventListener('error', onError);
      };
      sound.addEventListener('canplaythrough', onCanPlay);
      sound.addEventListener('error', onError);
      sound.src = url;
    });
  }
}

export async function playSound(type) {
  if (playingSounds[type]) {
    return;
  }

  const sound = sounds[type];
  if (!sound) {
    return;
  }

  playingSounds[type] = sound;
  try {
    await sound.play();
  }
  catch (e) {
    console.error(e);
  }
  finally {
    delete playingSounds[type];
  }
}
