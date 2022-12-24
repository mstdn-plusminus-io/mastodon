/* eslint-disable react/jsx-no-bind */

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
    color: 'white',
    overflow: 'auto',
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
    marginTop: '1em',
  },
  config: {
    fontSize: '1rem',
    marginTop: '1rem',
  },
  hint: {
    opacity: 0.6,
    marginTop: 4,
    fontSize: '0.85em',
  },
  description: {
    opacity: 0.6,
    marginTop: 4,
    marginLeft: 20,
    fontSize: '0.85em',
  },
  link: {
    color: 'rgb(165 199 255)',
    textDecoration: 'underline',
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
  customCwInputs: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: '1rem',
    marginLeft: 20,
    maxWidth: '640px',
  },
  customCwInput: {
    display: 'flex',
    width: '100%',
    marginBottom: '0.5rem',
  },
  customCwInputTextArea: {
    flex: 1,
    fontSize: 16,
  },
  customCwInputDeleteButton: {
    marginLeft: '0.25rem',
    fontSize: 16,
    minWidth: '25px',
    minHeight: '25px',
  },
  customCwInputAddButton: {
    fontSize: 16,
    minWidth: '25px',
    minHeight: '25px',
  },
};

const localStorageKeyPrefix = 'plusminus_config_';

export default class PlusMinusSettingModalLoader extends React.Component {

  constructor() {
    super();

    this.state = {
      open: false,
    };

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

  UNSAFE_componentWillMount() {
    const currentSettings = Object.keys(localStorage).filter((key) => key.startsWith(localStorageKeyPrefix)).reduce((obj, key) => {
      if (localStorage[key].startsWith('{') || localStorage[key].startsWith('[')) {
        try {
          obj[key.replace(localStorageKeyPrefix, '')] = JSON.parse(localStorage[key]);
        } catch (e) {
          // eslint-disable-next-line eqeqeq
          if (localStorage[key] != null) {
            obj[key.replace(localStorageKeyPrefix, '')] = localStorage[key];
          }
        }
      } else {
        obj[key.replace(localStorageKeyPrefix, '')] = localStorage[key];
      }

      return obj;
    }, { ...this.state.config });
    this.state = { config: currentSettings };
  }

  componentDidMount() {
    document.body.style.overflow = 'hidden';
  }

  componentWillUnmount() {
    document.body.style.overflow = '';
  }

  state = {
    config: {
      timestamp: 'relative',
      content: 'plain',
      sidenav: 'normal',
      post_button_location: 'normal',
      post_page_link: 'hidden',
      searchbox: 'hidden',
      custom_spoiler_button: 'hidden',
      custom_spoiler_buttons: ['そぎぎ'],
      sp_header: 'visible',
      decode_morse: 'disabled',
      encode_morse: 'disabled',
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

            <p style={styles.hint}>以下の設定はブラウザごとに保存されます</p>

            <div style={styles.section}>
              <h2>スマートフォン向けUI</h2>
            </div>

            <div style={styles.config}>
              <label>
                <input
                  type='checkbox'
                  checked={this.state.config.sidenav === 'reverse'}
                  onChange={(e) => this.updateConfig('sidenav', e.target.checked ? 'reverse' : 'normal')}
                />
                ナビゲージョンを左側に表示する
              </label>
              <p style={styles.description}>サイド ナビゲーションを左側に表示します</p>
            </div>
            <div style={styles.config}>
              <label>
                <input
                  type='checkbox'
                  checked={this.state.config.post_button_location === 'bottom_right'}
                  onChange={(e) => this.updateConfig('post_button_location', e.target.checked ? 'bottom_right' : 'normal')}
                />
                投稿ボタンを右下に表示する
              </label>
              <p style={styles.description}>画面上部の投稿ボタンを右下に表示します</p>
            </div>
            <div style={styles.config}>
              <label>
                <input
                  type='checkbox'
                  checked={this.state.config.sp_header === 'hidden'}
                  onChange={(e) => this.updateConfig('sp_header', e.target.checked ? 'hidden' : 'visible')}
                />
                ヘッダーを非表示にする
              </label>
              <p style={styles.description}>画面上部のヘッダーを非表示にします</p>
            </div>

            <div style={styles.section}>
              <h2>タイムライン</h2>
            </div>

            <div style={styles.config}>
              <label>
                <input
                  type='checkbox'
                  checked={this.state.config.timestamp === 'absolute'}
                  onChange={(e) => this.updateConfig('timestamp', e.target.checked ? 'absolute' : 'relative')}
                />
                絶対時刻表示
              </label>
              <p style={styles.description}>タイムライン中の時刻表示を相対時刻から絶対時刻に変更します</p>
            </div>
            <div style={styles.config}>
              <label>
                <input
                  type='checkbox'
                  checked={this.state.config.content === 'markdown'}
                  onChange={(e) => this.updateConfig('content', e.target.checked ? 'markdown' : 'plain')}
                />
                Markdownをレンダリング（実験的）
              </label>
              <p style={styles.description}><a style={styles.link} href='https://github.com/mixmark-io/turndown' target='_blank'>turndown</a>と<a style={styles.link} href='https://github.com/remarkjs/react-markdown' target='_blank'>react-markdown</a>を使用してMarkdownをレンダリングします<br />投稿のHTMLに依存するため、スペースや改行などが正しく反映されるとは限りません</p>
            </div>
            <div style={styles.config}>
              <label>
                <input
                  type='checkbox'
                  checked={this.state.config.post_page_link === 'visible'}
                  onChange={(e) => this.updateConfig('post_page_link', e.target.checked ? 'visible' : 'hidden')}
                />
                投稿元ページのリンクを表示する
              </label>
              <p style={styles.description}>投稿時刻の右側に投稿元ページを別タブで開くリンクを追加します</p>
            </div>
            <div style={styles.config}>
              <label>
                <input
                  type='checkbox'
                  checked={this.state.config.searchbox === 'visible'}
                  onChange={(e) => this.updateConfig('searchbox', e.target.checked ? 'visible' : 'hidden')}
                />
                Misskey Flavored Markdownの検索窓を展開する
              </label>
              <p style={styles.description}><a style={styles.link} href='https://wiki.misskey.io/ja/function/mfm#%E6%A4%9C%E7%B4%A2%E7%AA%93' target='_blank'>Misskey Flavored Markdownの検索窓</a>を投稿本文の下に展開します</p>
            </div>
            <div style={styles.config}>
              <label>
                <input
                  type='checkbox'
                  checked={this.state.config.decode_morse === 'enabled'}
                  onChange={(e) => this.updateConfig('decode_morse', e.target.checked ? 'enabled' : 'disabled')}
                />
                y4aスタイルのモールス符号をデコードする
              </label>
              <p style={styles.description}><a style={styles.link} href='https://github.com/shibafu528/Yukari' target='_blank'>Yukari for Android</a>スタイルの日本語モールス符号をカタカナに変換して表示します</p>
            </div>

            <div style={styles.section}>
              <h2>投稿欄</h2>
            </div>

            <div style={styles.config}>
              <label>
                <input
                  type='checkbox'
                  checked={this.state.config.custom_spoiler_button === 'visible'}
                  onChange={(e) => this.updateConfig('custom_spoiler_button', e.target.checked ? 'visible' : 'hidden')}
                />
                CW (Content Warning)のプリセットボタンを表示する
              </label>
              <p style={styles.description}>ボタンを押すだけで任意の文章をCWに入力できるようになります<br />また、CWが有効になっていない場合は自動的に有効になります</p>

              <div style={styles.customCwInputs}>
                {this.state.config.custom_spoiler_buttons?.map((buttonText, index) => (
                  <div key={`${index}_${this.state.config.custom_spoiler_buttons.length}`} style={styles.customCwInput}>
                    <input
                      style={styles.customCwInputTextArea}
                      type='text'
                      value={buttonText}
                      onChange={(e) => {
                        this.state.config.custom_spoiler_buttons[index] = e.target.value;
                        this.updateConfig('custom_spoiler_buttons', this.state.config.custom_spoiler_buttons);
                      }}
                    />
                    <button
                      style={styles.customCwInputDeleteButton}
                      onClick={() => {
                        this.state.config.custom_spoiler_buttons.splice(index, 1);
                        this.updateConfig('custom_spoiler_buttons', this.state.config.custom_spoiler_buttons);
                      }}
                    >
                      -
                    </button>
                  </div>
                ))}
                <button
                  style={styles.customCwInputAddButton}
                  onClick={() => {
                    this.state.config.custom_spoiler_buttons.push('');
                    this.updateConfig('custom_spoiler_buttons', this.state.config.custom_spoiler_buttons);
                  }}
                >
                  +
                </button>
              </div>
            </div>
            <div style={styles.config}>
              <label>
                <input
                  type='checkbox'
                  checked={this.state.config.encode_morse === 'enabled'}
                  onChange={(e) => this.updateConfig('encode_morse', e.target.checked ? 'enabled' : 'disabled')}
                />
                y4aスタイルのモールス符号にエンコードするボタンを表示する
              </label>
              <p style={styles.description}>ひらがな/カタカナを<a style={styles.link} href='https://github.com/shibafu528/Yukari' target='_blank'>Yukari for Android</a>スタイルの日本語モールス符号に変換します<br />アルファベット/漢字/一部を除く記号は対象外です</p>
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
    Object.keys(this.state.config).forEach((key) =>
      localStorage[`${localStorageKeyPrefix}${key}`] = typeof this.state.config[key] === 'object' ? JSON.stringify(this.state.config[key]) : this.state.config[key],
    );
    location.reload();
  }

}
