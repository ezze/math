import React, { Component } from 'react';
import ReactLoading from 'react-loading';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import './sass/index.sass';

class ModalNotification extends Component {
  static propTypes = {
    title: PropTypes.string,
    text: PropTypes.string,
    style: PropTypes.string,
    visible: PropTypes.bool.isRequired,
    loading: PropTypes.bool.isRequired,
    close: PropTypes.func
  };

  static defaultProps = {
    visible: false,
    loading: false
  };

  constructor(props) {
    super(props);
    this.onCloseClick = this.onCloseClick.bind(this);
  }

  render() {
    const { title = '', text = '', style, visible, loading, close } = this.props;
    const className = classNames({
      modal: true,
      'is-active': visible
    });
    const notificationClassName = classNames({
      notification: true,
      [`is-${style}`]: !!style
    });

    const content = (
      <div>
        {title ? <h1 className="title is-4">{title}</h1> : ''}
        {text ? <p>{text}</p> : ''}
      </div>
    );

    const nestedContent = this.props.children ? (
      <div className="modal-notification-nested">
        {this.props.children}
      </div>
    ) : '';

    return (
      <div className={className}>
        <div className="modal-background"></div>
        <div className="modal-content">
          <div className={notificationClassName}>
            {typeof close === 'function' ? <div className="delete" onClick={this.onCloseClick}></div> : ''}
            {content}
            {nestedContent}
            {loading ? <ReactLoading className="modal-notification-loading" type="spin" /> : ''}
          </div>
        </div>
      </div>
    );
  }

  onCloseClick() {
    this.props.close();
  }
}

export default ModalNotification;
