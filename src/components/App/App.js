import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';

import PlayField from '../PlayField';
import Toolbar from '../Toolbar';
import Settings from '../Settings';
import About from '../About';
import State from '../State';
import UserNamePrompt from '../UserNamePrompt';
import HallOfFame from '../HallOfFame';
import AudioNotification from '../AudioNotification';
import ModalNotification from '../ModalNotification';
import GameOver from '../GameOver';
import Loading from '../Loading';
import YandexMetrika from '../YandexMetrika';

import { platformType } from '../../constants';

const mobileUnsupportedText =
  'Мобильные устройства не поддерживаются. Мы убеждены, что использование смартфонов ' +
  'детьми не способствует их нормальному развитию. Если Вы считаете иначе, пожалуйста, свяжитесь с разработчиками.';

@inject('generalStore', 'challengeStore') @observer
class App extends Component {
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
    if (event.keyCode === 68 && event.shiftKey) {
      const { generalStore } = this.props;
      const { developerMode } = generalStore;
      generalStore.setDeveloperMode(!developerMode);
    }
  }

  render() {
    return platformType !== 'mobile' ? (
      <div className="app">
        <PlayField />
        <Toolbar />
        <Settings />
        <About />
        <State />
        <UserNamePrompt />
        <HallOfFame />
        <AudioNotification />
        <GameOver />
        <Loading />
        <YandexMetrika />
      </div>
    ) : (
      <div className="app">
        <ModalNotification text={mobileUnsupportedText} visible={true} style="danger" />
        <YandexMetrika />
      </div>
    );
  }
}

export default App;
