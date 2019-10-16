import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';

import ModalNotification from '../ModalNotification';

import { MODAL_ABOUT } from '../../constants';

import './sass/index.sass';

const version = VERSION; // eslint-disable-line no-undef

@inject('generalStore') @observer
class About extends Component {
  constructor(props) {
    super(props);
    this.close = this.close.bind(this);
  }

  close() {
    this.props.generalStore.setModal(null);
  }

  render() {
    const { generalStore } = this.props;
    const { modal } = generalStore;
    const title = 'О приложении';
    const text = 'Игра разработана под впечатлением от Классических Бесед и посвящена изучению арифметики.';
    return (
      <ModalNotification title={title} text={text} visible={modal === MODAL_ABOUT} close={this.close}>
        <table className="about-table" align="center">
          <tbody>
            <tr>
              <td>Версия</td>
              <td>{version}</td>
            </tr>
            <tr>
              <td>Авторы</td>
              <td>Дмитрий Пушков</td>
            </tr>
            <tr>
              <td></td>
              <td>Тамара Пушкова</td>
            </tr>
            <tr>
              <td>Поддерживаемые браузеры</td>
              <td>Google Chrome (Chromium)</td>
            </tr>
            <tr>
              <td></td>
              <td>Mozilla Firefox</td>
            </tr>
          </tbody>
        </table>
      </ModalNotification>
    );
  }
}

export default About;
