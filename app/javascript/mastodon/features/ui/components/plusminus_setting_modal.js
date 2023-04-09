/* eslint-disable react/jsx-no-bind */

import React from 'react';
import PropTypes from 'prop-types';
import Button from 'mastodon/components/button';
import { FormattedMessage } from 'react-intl';
import { open, download } from '../util/file';

const styles = {
  container: {
    padding: '1rem',
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
  },
  title: {
    fontSize: '1.6rem',
    lineHeight: '2em',
    display: 'flex',
    justifyContent: 'space-between',
  },
  buttonContainer: {
    display: 'flex',
  },
  importButton: {
    marginRight: '1rem',
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
  childConfig: {
    fontSize: '1rem',
    marginTop: '1rem',
    marginLeft: 20,
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
  customCwInputWrapper: {
    display: 'flex',
    flexWrap: 'wrap',
    flex: 1,
  },
  customCwInputTextArea: {
    flex: 2,
    fontSize: 16,
  },
  customCwInputSelect: {
    flex: 1,
    fontSize: 16,
  },
  customCwInputButtonWrapper: {
    display: 'flex',
    alignItems: 'center',
  },
  customCwInputButton: {
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
  developerMode: {
    border: 0,
    padding: 0,
    background: 'transparent',
    color: 'inherit',
    fontSize: 'inherit',
    cursor: 'text',
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

  onClickCancel = () => {
    this.setState({ open: false });
  };

  render() {
    if (this.state.open) {
      return (
        <PlusMinusSettingModal onCancel={this.onClickCancel} />
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
    this.parseConfig(localStorage);
  }

  parseConfig(baseObj) {
    const currentSettings = Object.keys(baseObj).filter((key) => key.startsWith(localStorageKeyPrefix)).reduce((obj, key) => {
      if (baseObj[key].startsWith('{') || baseObj[key].startsWith('[')) {
        try {
          obj[key.replace(localStorageKeyPrefix, '')] = JSON.parse(baseObj[key]);
        } catch (e) {
          // eslint-disable-next-line eqeqeq
          if (baseObj[key] != null) {
            obj[key.replace(localStorageKeyPrefix, '')] = baseObj[key];
          }
        }
      } else {
        obj[key.replace(localStorageKeyPrefix, '')] = baseObj[key];
      }
      return obj;
    }, { ...this.state.config });
    this.setState({ config: currentSettings });
  }

  componentDidMount() {
    document.body.style.overflow = 'hidden';
  }

  componentWillUnmount() {
    document.body.style.overflow = '';
  }

  state = {
    developerModeButtonClicked: 0,
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
      reload_button: 'hidden',
      keyword_based_visibility: 'disabled',
      spoiler_keyword_based_visibility: 'disabled',
      keyword_based_visibilities: [{ keyword: 'ここだけの話なんだけど', visibility: 'unlisted' }],
      emotional_button: 'hidden',
      post_half_modal: 'disabled',
      quick_report: 'hidden',
      live_mode_button: 'hidden',
      developer_mode: 'disabled',
      decode_ame: 'disabled',
      encode_ame: 'disabled',
    },
  };

  updateConfig(key, value) {
    this.setState({ config: { ...this.state.config, [key]: value } });
  }

  onClickDeveloperModeButton = () => {
    if (this.state.config.developer_mode === 'enabled') {
      return;
    }

    this.setState({
      developerModeButtonClicked: this.state.developerModeButtonClicked+1,
    }, () => {
      if (this.state.developerModeButtonClicked === 7) {
        localStorage[`${localStorageKeyPrefix}developer_mode`] = 'enabled';
        alert('開発者モードを有効化しました。リロードします。');
        location.reload();
      }
    });
  };

  render() {
    return (
      <div className={'plusminus-config__root'}>
        <div style={styles.container}>
          <h1 style={styles.title}>
            <div>
              plusminus設定 (<button style={styles.developerMode} onClick={this.onClickDeveloperModeButton}>β</button>{this.state.config.developer_mode === 'enabled' && '!'})
            </div>
            <div style={styles.buttonContainer}>
              <div style={styles.importButton}>
                <Button className='button-secondary' onClick={this.handleImport}>インポート</Button>
              </div>
              <div>
                <Button className='button-secondary' onClick={this.handleExport}>エクスポート</Button>
              </div>
            </div>
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
                  checked={this.state.config.post_half_modal === 'enabled'}
                  onChange={(e) => this.updateConfig('post_half_modal', e.target.checked ? 'enabled' : 'disabled')}
                />
                投稿欄をハーフモーダルで表示する
              </label>
              <p style={styles.description}>投稿欄を単一の画面で表示せずに、画面下部にハーフモーダルで表示します</p>
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
            <div style={styles.config}>
              <label>
                <input
                  type='checkbox'
                  checked={this.state.config.reload_button === 'visible'}
                  onChange={(e) => this.updateConfig('reload_button', e.target.checked ? 'visible' : 'hidden')}
                />
                リロードボタンを表示する
              </label>
              <p style={styles.description}>サイド ナビゲーション最上部にリロードボタンを表示します<br />PWAとしてインストールしている場合にリロードできない問題を暫定的に解決します</p>
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
              <p style={styles.description}><a className={'link'} href='https://github.com/mixmark-io/turndown' target='_blank'>turndown</a>と<a className={'link'} href='https://github.com/remarkjs/react-markdown' target='_blank'>react-markdown</a>を使用してMarkdownをレンダリングします<br />投稿のHTMLに依存するため、スペースや改行などが正しく反映されるとは限りません</p>
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
              <p style={styles.description}><a className={'link'} href='https://wiki.misskey.io/ja/function/mfm#%E6%A4%9C%E7%B4%A2%E7%AA%93' target='_blank'>Misskey Flavored Markdownの検索窓</a>を投稿本文の下に展開します</p>
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
              <p style={styles.description}>
                <a className={'link'} href='https://github.com/shibafu528/Yukari' target='_blank'>Yukari for Android</a>スタイルの日本語モールス符号をカタカナに変換して表示します<br />
                英数モールス符号もデコードできますが、互換性はありません
              </p>
            </div>
            {this.state.config.developer_mode === 'enabled' && <div style={styles.config}>
              <label>
                <input
                  type='checkbox'
                  checked={this.state.config.decode_ame === 'enabled'}
                  onChange={(e) => this.updateConfig('decode_ame', e.target.checked ? 'enabled' : 'disabled')}
                />
                ᕂᕙᕸᕵᖋᕂᖁᕸᖓᕋᖓᖒᕧᕓーᕩᕙᖋ
              </label>
            </div>}
            <div style={styles.config}>
              <label>
                <input
                  type='checkbox'
                  checked={this.state.config.quick_report === 'visible'}
                  onChange={(e) => this.updateConfig('quick_report', e.target.checked ? 'visible' : 'hidden')}
                />
                投稿下部のアクションボタンに通報ボタンを追加する
              </label>
              <p style={styles.description}>
                通報をすばやく、簡単に行えるようになります
              </p>
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
                      style={styles.customCwInputButton}
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
                  checked={this.state.config.keyword_based_visibility === 'enabled'}
                  onChange={(e) => this.updateConfig('keyword_based_visibility', e.target.checked ? 'enabled' : 'disabled')}
                />
                キーワードで公開範囲を自動的に設定する
              </label>
              <p style={styles.description}>指定した文字列が本文に含まれる場合に、公開範囲を自動的に設定します</p>

              <div style={styles.childConfig}>
                <label>
                  <input
                    type='checkbox'
                    checked={this.state.config.spoiler_keyword_based_visibility === 'enabled'}
                    onChange={(e) => this.updateConfig('spoiler_keyword_based_visibility', e.target.checked ? 'enabled' : 'disabled')}
                  />
                  CW (Content Warning)も対象にする
                </label>
                <p style={styles.description}>
                  指定した文字列がCWに含まれる場合にも、公開範囲を自動的に設定します<br />
                  CWプリセットボタンで有用です
                </p>
              </div>

              <div style={styles.config}>
                <p style={styles.description}>キーワードは上にあるものが優先されます</p>
                <div style={styles.customCwInputs}>
                  {this.state.config.keyword_based_visibilities?.map(({ keyword, visibility }, index) => (
                    <div key={`${index}_${this.state.config.custom_spoiler_buttons.length}`} style={styles.customCwInput}>
                      <div className='custom-cw-input__wrapper'  style={styles.customCwInputWrapper}>
                        <input
                          style={styles.customCwInputTextArea}
                          type='text'
                          placeholder={'キーワード'}
                          value={keyword}
                          onChange={(e) => {
                            this.state.config.keyword_based_visibilities[index].keyword = e.target.value;
                            this.updateConfig('keyword_based_visibilities', this.state.config.keyword_based_visibilities);
                          }}
                        />
                        <select
                          style={styles.customCwInputSelect}
                          value={visibility}
                          onChange={(e) => {
                            this.state.config.keyword_based_visibilities[index].visibility = e.target.value;
                            this.updateConfig('keyword_based_visibilities', this.state.config.keyword_based_visibilities);
                          }}
                        >
                          <option value='public'>Public</option>
                          <option value='unlisted'>Unlisted</option>
                          <option value='private'>Followers only</option>
                          <option value='direct'>Mentioned people only</option>
                        </select>
                      </div>
                      <div className='custom-cw-input-button__wrapper' style={styles.customCwInputButtonWrapper}>
                        <div className='custom-cw-input-button__wrapper-order-button'>
                          <button
                            style={styles.customCwInputButton}
                            disabled={index === 0}
                            onClick={() => {
                              const obj = this.state.config.keyword_based_visibilities[index];
                              this.state.config.keyword_based_visibilities.splice(index, 1);
                              this.state.config.keyword_based_visibilities.splice(index - 1, 0, obj);
                              this.updateConfig('keyword_based_visibilities', this.state.config.keyword_based_visibilities);
                            }}
                          >
                            ↑
                          </button>
                          <button
                            style={styles.customCwInputButton}
                            disabled={index === this.state.config.keyword_based_visibilities.length - 1}
                            onClick={() => {
                              const obj = this.state.config.keyword_based_visibilities[index];
                              this.state.config.keyword_based_visibilities.splice(index, 1);
                              this.state.config.keyword_based_visibilities.splice(index + 1, 0, obj);
                              this.updateConfig('keyword_based_visibilities', this.state.config.keyword_based_visibilities);
                              this.updateConfig('keyword_based_visibilities', this.state.config.keyword_based_visibilities);
                            }}
                          >
                            ↓
                          </button>
                        </div>

                        <button
                          style={styles.customCwInputButton}
                          onClick={() => {
                            this.state.config.keyword_based_visibilities.splice(index, 1);
                            this.updateConfig('keyword_based_visibilities', this.state.config.keyword_based_visibilities);
                          }}
                        >
                          -
                        </button>
                      </div>
                    </div>
                  ))}
                  <button
                    style={styles.customCwInputAddButton}
                    onClick={() => {
                      this.state.config.keyword_based_visibilities.push({ keyword: '', visibility: 'public' });
                      this.updateConfig('keyword_based_visibilities', this.state.config.keyword_based_visibilities);
                    }}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
            <div style={styles.config}>
              <label>
                <input
                  type='checkbox'
                  checked={this.state.config.emotional_button === 'visible'}
                  onChange={(e) => this.updateConfig('emotional_button', e.target.checked ? 'visible' : 'hidden')}
                />
                半角英数をUnicodeの数学用英数字ブロックに置き換えるボタンを表示する
              </label>
              <p style={styles.description}>
                <code>Lorem ipsum dolor sit amet,</code> を <code>𝓛𝓸𝓻𝓮𝓶 𝓲𝓹𝓼𝓾𝓶 𝓭𝓸𝓵𝓸𝓻 𝓼𝓲𝓽 𝓪𝓶𝓮𝓽,</code> などのエモい文字に置き換えるボタンを表示します
              </p>
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
              <p style={styles.description}>
                ひらがな/カタカナを<a className={'link'} href='https://github.com/shibafu528/Yukari' target='_blank'>Yukari for Android</a>スタイルのモールス符号に変換します<br />
                英数モールス符号もエンコードできますが、互換性はありません<br />
                漢字/一部を除く記号は対象外です
              </p>
            </div>
            {this.state.config.developer_mode === 'enabled' && <div style={styles.config}>
              <label>
                <input
                  type='checkbox'
                  checked={this.state.config.encode_ame === 'enabled'}
                  onChange={(e) => this.updateConfig('encode_ame', e.target.checked ? 'enabled' : 'disabled')}
                />
                ᕂᕙᕸᕵᖋᕂᖁᕸᖓᕋᖓᖒᕊᕓᕪᕆᕼᕟᖓᖒᕲᖇᕆᕘᕙᖋ
              </label>
            </div>}
            <div style={styles.config}>
              <label>
                <input
                  type='checkbox'
                  checked={this.state.config.live_mode_button === 'visible'}
                  onChange={(e) => this.updateConfig('live_mode_button', e.target.checked ? 'visible' : 'hidden')}
                />
                実況モードを切り替えるボタンを表示する
              </label>
              <p style={styles.description}>
                投稿後もハッシュタグを投稿欄に残すことで、ハッシュタグを使った実況が行いやすくなります<br />
                この設定を無効化すると、実況モードも自動的に無効化されます
              </p>
            </div>
          </div>
        </div>

        <div style={styles.actionBar}>
          <div style={styles.cancelButton}>
            <Button onClick={this.handleCancel} className='button-secondary'>
              <FormattedMessage id='confirmation_modal.cancel' defaultMessage='Cancel' />
            </Button>
          </div>
          <Button onClick={this.handleSave}>
            <FormattedMessage id='compose_form.save_changes' defaultMessage='Save' />
          </Button>
        </div>
      </div>
    );
  }

  handleCancel = () => {
    this.props.onCancel();
  };

  convert = (obj = {}) => {
    Object.keys(this.state.config).forEach((key) =>
      obj[`${localStorageKeyPrefix}${key}`] = typeof this.state.config[key] === 'object' ? JSON.stringify(this.state.config[key]) : this.state.config[key],
    );
    return obj;
  };

  handleImport = async () => {
    const text = await open('.json');
    if (!text) {
      return;
    }

    try {
      const config = JSON.parse(text);
      this.parseConfig(config);
    } catch (e) {
      console.error(e);
      alert('JSONのパースに失敗しました');
    }
  };

  handleExport = () => {
    const config = JSON.stringify(this.convert());
    download(`mastodon-plusminus-settings-${new Date().getTime()}.json`, config);
  };

  handleSave = () => {
    Object.keys(this.state.config).forEach((key) =>
      localStorage[`${localStorageKeyPrefix}${key}`] = typeof this.state.config[key] === 'object' ? JSON.stringify(this.state.config[key]) : this.state.config[key],
    );

    if (this.state.config.live_mode_button === 'hidden') {
      // NOTE: 実況モードボタンが無効化されているので、実況モードも無効化する
      localStorage[`${localStorageKeyPrefix}live_mode`] = 'disabled';
    }

    location.reload();
  };

}
