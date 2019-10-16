import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';

import ModalNotification from '../ModalNotification';

import {
  MODAL_AUDIO_NOTIFICATION,
  MODAL_USER_NAME,
  modalErrors
} from '../../constants';

@inject('generalStore', 'challengeStore') @observer
class AudioNotification extends Component {
  constructor(props) {
    super(props);
    this.close = this.close.bind(this);
  }

  componentDidMount() {
    const { generalStore } = this.props;
    const { soundEnabled, developerMode, modal } = generalStore;
    if (soundEnabled && !developerMode && !modalErrors.includes(modal)) {
      this.previousModal = modal;
      generalStore.setModal(MODAL_AUDIO_NOTIFICATION);
    }
  }

  close() {
    const { generalStore, challengeStore } = this.props;
    if (!challengeStore.userName) {
      generalStore.setModal(MODAL_USER_NAME);
    }
    else {
      generalStore.setModal(this.previousModal);
    }
    delete this.previousModal;
  }

  render() {
    const { generalStore } = this.props;
    const { modal } = generalStore;
    const title = 'Аудио уведомление';
    const text = 'Пожалуйста, обратите внимание, что взаимодействуя со страницей, Вы разрешаете ей воспроизводить ' +
      'звуки. Если Вы хотите отказаться от звукового сопровождения, измените соответствующий параметр в настройках ' +
      'игры.';
    return (
      <ModalNotification
        id="audio"
        title={title}
        text={text}
        style="warning"
        visible={modal === MODAL_AUDIO_NOTIFICATION}
        close={this.close}
      />
    );
  }
}

export default AudioNotification;
