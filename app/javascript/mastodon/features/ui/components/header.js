import React from 'react';
import Logo from 'mastodon/components/logo';
import { Link, withRouter } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { registrationsOpen, me } from 'mastodon/initial_state';
import Avatar from 'mastodon/components/avatar';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { openModal } from 'mastodon/actions/modal';
import Icon from 'mastodon/components/icon';
import ComposeFormContainer from '../../compose/containers/compose_form_container';

const Account = connect(state => ({
  account: state.getIn(['accounts', me]),
}))(({ account }) => (
  <Link to={`/@${account.get('acct')}`} title={account.get('acct')}>
    <Avatar account={account} size={35} />
  </Link>
));

const mapDispatchToProps = (dispatch) => ({
  openClosedRegistrationsModal() {
    dispatch(openModal('CLOSED_REGISTRATIONS'));
  },
});

export default @withRouter
@connect(null, mapDispatchToProps)
class Header extends React.PureComponent {

  static contextTypes = {
    identity: PropTypes.object,
  };

  static propTypes = {
    openClosedRegistrationsModal: PropTypes.func,
    location: PropTypes.object,
  };

  openComposeHalfModal = () => {
    document.documentElement.classList.add('show-compose-half-modal');
  }

  closeComposeHalfModal = () => {
    document.documentElement.classList.remove('show-compose-half-modal');
  }

  render () {
    const { signedIn } = this.context.identity;
    const { location, openClosedRegistrationsModal } = this.props;

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
              <div className={'compose-half-modal'}><ComposeFormContainer showClose onClose={this.closeComposeHalfModal} /></div>
              <div className={`button ${isBottomRightButton ? 'bottom_right' : ''}`} onClick={this.openComposeHalfModal} onKeyUp={this.openComposeHalfModal}>
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
      let signupButton;

      if (registrationsOpen) {
        signupButton = (
          <a href='/auth/sign_up' className='button button-tertiary'>
            <FormattedMessage id='sign_in_banner.create_account' defaultMessage='Create account' />
          </a>
        );
      } else {
        signupButton = (
          <button className='button button-tertiary' onClick={openClosedRegistrationsModal}>
            <FormattedMessage id='sign_in_banner.create_account' defaultMessage='Create account' />
          </button>
        );
      }

      content = (
        <>
          <a href='/auth/sign_in' className='button'><FormattedMessage id='sign_in_banner.sign_in' defaultMessage='Sign in' /></a>
          {signupButton}
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
