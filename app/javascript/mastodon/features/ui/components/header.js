import React from 'react';
import Logo from 'mastodon/components/logo';
import { Link, withRouter } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { registrationsOpen, me } from 'mastodon/initial_state';
import Avatar from 'mastodon/components/avatar';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Icon from 'mastodon/components/icon';

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

  render () {
    const { signedIn } = this.context.identity;
    const { location } = this.props;

    let content;

    if (signedIn) {
      const isBottomRightButton = localStorage.plusminus_config_post_button_location === 'bottom_right';
      content = (
        <>
          {location.pathname !== '/publish' && (
            <Link to='/publish' className={`button ${isBottomRightButton ? 'bottom_right' : ''}`}>
              {isBottomRightButton && <Icon id='send' fixedWidth />}
              {!isBottomRightButton && <FormattedMessage id='compose_form.publish' defaultMessage='Publish' /> }
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
