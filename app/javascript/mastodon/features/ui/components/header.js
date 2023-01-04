import React from 'react';
import Logo from 'mastodon/components/logo';
import { Link, withRouter } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { registrationsOpen, me } from 'mastodon/initial_state';
import Avatar from 'mastodon/components/avatar';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Icon from 'mastodon/components/icon';
import ComposeFormContainer from '../../compose/containers/compose_form_container';

const Account = connect(state => ({
  account: state.getIn(['accounts', me]),
}))(({ account }) => (
  <Link to={`/@${account.get('acct')}`} title={account.get('acct')}>
    <Avatar account={account} size={35} />
  </Link>
));

export default @withRouter
class Header extends React.PureComponent {

  static contextTypes = {
    identity: PropTypes.object,
  };

  static propTypes = {
    location: PropTypes.object,
  };

  openComposeHalfModal() {
    document.documentElement.classList.add('show-compose-half-modal');
  }

  closeComposeHalfModal() {
    document.documentElement.classList.remove('show-compose-half-modal');
  }

  render () {
    const { signedIn } = this.context.identity;
    const { location } = this.props;

    let content;

    if (signedIn) {
      const isBottomRightButton = localStorage.plusminus_config_post_button_location === 'bottom_right';
      const useHalfModal = localStorage.plusminus_config_post_half_modal === 'enabled';
      const buttonInner = (
        <>
          {isBottomRightButton && <Icon id='send' fixedWidth />}
          {!isBottomRightButton && <FormattedMessage id='compose_form.publish' defaultMessage='Publish' /> }
        </>
      );
      content = (
        <>
          {useHalfModal ? (
            <>
              <div className={'compose-half-modal'}><ComposeFormContainer showClose onClose={() => this.closeComposeHalfModal()} /></div>
              <div className={`button ${isBottomRightButton ? 'bottom_right' : ''}`} onClick={() => this.openComposeHalfModal()}>
                {buttonInner}
              </div>
            </>
          ) : location.pathname !== '/publish' && (
            <Link to='/publish' className={`button ${isBottomRightButton ? 'bottom_right' : ''}`}>
              {buttonInner}
            </Link>
          )}
          <Account />
        </>
      );
    } else {
      content = (
        <>
          <a href='/auth/sign_in' className='button'><FormattedMessage id='sign_in_banner.sign_in' defaultMessage='Sign in' /></a>
          <a href={registrationsOpen ? '/auth/sign_up' : 'https://joinmastodon.org/servers'} className='button button-tertiary'><FormattedMessage id='sign_in_banner.create_account' defaultMessage='Create account' /></a>
        </>
      );
    }

    return (
      <div className='ui__header'>
        <Link to='/' className='ui__header__logo'><Logo /></Link>

        <div className='ui__header__links'>
          {content}
        </div>
      </div>
    );
  }

}
