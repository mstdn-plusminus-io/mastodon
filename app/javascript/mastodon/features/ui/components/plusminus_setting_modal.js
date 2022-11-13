import React from 'react';
import PropTypes from 'prop-types';
import Button from 'mastodon/components/button';
import { FormattedMessage } from 'react-intl';

const styles = {
  root: {
    position: 'fixed',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.888)',
    backdropFilter: 'blur(4px)',
    zIndex: 99999,
    display: 'flex',
    flexDirection: 'column',
    fontSize: 'initial',
  },
  container: {
    padding: '1rem',
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
  },
  title: {
    fontSize: '1.6rem',
    lineHeight: '2em',
  },
  main: {
    flex: 1,
  },
  section: {
    fontSize: '1.3rem',
    lineHeight: '2em',
  },
  config: {
    fontSize: '1rem',
  },
  description: {
    opacity: 0.6,
    marginTop: 4,
    marginLeft: 20,
    fontSize: '0.85em',
  },
  actionBar: {
    display: 'flex',
    justifyContent: 'flex-end',
    padding: '1rem',
    paddingTop: 0,
  },
  cancelButton: {
    marginRight: '1rem',
  },
};

const localStorageKeyPrefix = 'plusminus_config_';

export default class PlusMinusSettingModalLoader extends React.Component {

  static propTypes = {
  };

  state = {
    open: false,
  }

  constructor() {
    super();

    this.onOpenEvent = this.onOpenEvent.bind(this);
  }

  componentDidMount() {
    window.__PLUS_MINUS_EVENTS__.addEventListener('openConfig', this.onOpenEvent);
  }

  componentWillUnmount() {
    window.__PLUS_MINUS_EVENTS__.removeEventListener('openConfig', this.onOpenEvent);
  }

  onOpenEvent() {
    this.setState({
      open: true,
    });
  }

  render() {
    if (this.state.open) {
      return (
        <PlusMinusSettingModal onCancel={() => this.setState({ open: false })} />
      );
    }
    return <></>;
  }

}


export class PlusMinusSettingModal extends React.Component {

  static propTypes = {
    onCancel: PropTypes.func.isRequired,
  };

  componentDidMount() {
    document.body.style.overflow = 'hidden';

    const currentSettings = Object.keys(localStorage).filter((key) => key.startsWith(localStorageKeyPrefix)).reduce((obj, key) => {
      obj[key.replace(localStorageKeyPrefix, '')] = localStorage[key];
      return obj;
    }, {});
    this.setState({ config: { ...this.state.config, ...currentSettings } });
  }

  componentWillUnmount() {
    document.body.style.overflow = '';
  }

  state = {
    config: {
      timestamp: 'relative',
    },
  };

  updateConfig(key, value) {
    this.setState({ config: { ...this.state.config, [key]: value } });
  }

  render() {
    return (
      <div style={styles.root}>
        <div style={styles.container}>
          <h1 style={styles.title}>
            plusminus設定 (β)
          </h1>

          <div style={styles.main}>
            <hr />

            <div style={styles.section}>
              <h2>タイムライン</h2>
            </div>

            <div style={styles.config}>
              <label>
                <input
                  name='mark-sensitive'
                  type='checkbox'
                  checked={this.state.config.timestamp === 'absolute'}
                  onChange={(e) => this.updateConfig('timestamp', e.target.checked ? 'absolute' : 'relative')}
                />
                絶対時刻表示
              </label>
              <p style={styles.description}>タイムライン中の時刻表示を相対時刻から絶対時刻に変更します</p>
            </div>
          </div>
        </div>

        <div style={styles.actionBar}>
          <div style={styles.cancelButton}>
            <Button onClick={() => this.handleCancel()} className='button-secondary'>
              <FormattedMessage id='confirmation_modal.cancel' defaultMessage='Cancel' />
            </Button>
          </div>
          <Button onClick={() => this.handleSave()}>
            <FormattedMessage id='compose_form.save_changes' defaultMessage='Save' />
          </Button>
        </div>
      </div>
    );
  }

  handleCancel() {
    this.props.onCancel();
  }

  handleSave() {
    Object.keys(this.state.config).forEach((key) => localStorage[`${localStorageKeyPrefix}${key}`] = this.state.config[key]);
    location.reload();
  }

}
