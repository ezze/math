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
import GameOver from '../GameOver';
import Loading from '../Loading';

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
    return (
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
      </div>
    );
  }
}

export default App;
