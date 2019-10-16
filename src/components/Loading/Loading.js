import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';

import ModalNotification from '../ModalNotification';

@inject('generalStore', 'challengeStore') @observer
class Loading extends Component {
  constructor(props) {
    super(props);
    this.onRetryClick = this.onRetryClick.bind(this);
  }

  render() {
    const { generalStore, challengeStore } = this.props;
    const { modal } = generalStore;
    const { loading, loadingError } = challengeStore;
    const content = !loading ? (
      <div className="has-text-centered">
        <button className="button" onClick={this.onRetryClick}>Повторить</button>
      </div>
    ) : '';
    const title = loadingError ? 'Ошибка' : 'Загрузка';
    const text = loadingError ?
      'Произошла ошибка при загрузке данных!' : 'Пожалуйста, подождите...идёт загрузка данных.';
    const style = loadingError ? 'danger' : 'info';
    const visible = !modal && (loading || loadingError);
    return (
      <ModalNotification title={title} text={text} style={style} visible={visible} loading={loading}>
        {content}
      </ModalNotification>
    );
  }

  onRetryClick() {
    const { challengeStore } = this.props;
    challengeStore.start().catch(e => console.error(e));
  }
}

export default Loading;
