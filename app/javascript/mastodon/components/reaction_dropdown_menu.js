import React from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import IconButton from './icon_button';
import Overlay from 'react-overlays/Overlay';
import { supportsPassiveEvents } from 'detect-passive-events';
import classNames from 'classnames';
import { CircularProgress } from 'mastodon/components/loading_indicator';
import ReactionPickerContainer from '../containers/reaction_picker_container';

const listenerOptions = supportsPassiveEvents ? { passive: true } : false;
let id = 1000;

class ReactionDropdownMenu extends React.PureComponent {

  static contextTypes = {
    router: PropTypes.object,
  };

  static propTypes = {
    loading:PropTypes.bool,
    onClose: PropTypes.func.isRequired,
    onPickEmoji: PropTypes.func.isRequired,
    style: PropTypes.object,
    openedViaKeyboard: PropTypes.bool,
  };

  static defaultProps = {
    style: {},
  };

  handleDocumentClick = e => {
    if (this.node && !this.node.contains(e.target)) {
      this.props.onClose();
    }
  };

  componentDidMount () {
    document.addEventListener('click', this.handleDocumentClick, false);
    document.addEventListener('keydown', this.handleKeyDown, false);
    document.addEventListener('touchend', this.handleDocumentClick, listenerOptions);

    if (this.focusedItem && this.props.openedViaKeyboard) {
      this.focusedItem.focus({ preventScroll: true });
    }

    this.setState({ mounted: true });
  }

  componentWillUnmount () {
    document.removeEventListener('click', this.handleDocumentClick, false);
    document.removeEventListener('keydown', this.handleKeyDown, false);
    document.removeEventListener('touchend', this.handleDocumentClick, listenerOptions);
  }

  setRef = c => {
    this.node = c;
  };

  setFocusRef = c => {
    this.focusedItem = c;
  };

  handleKeyDown = e => {
    switch(e.key) {
    case 'Escape':
      this.props.onClose();
      break;
    }
  };

  render () {
    const { loading, onPickEmoji, onClose } = this.props;

    return (
      <div className={classNames('dropdown-menu__container', { 'dropdown-menu__container--loading': loading })} ref={this.setRef}>
        {loading && (
          <CircularProgress size={30} strokeWidth={3.5} />
        )}
        {!loading && (
          <div className='reaction-dropdown-menu__picker'>
            <ReactionPickerContainer onPickEmoji={onPickEmoji} onClose={onClose} />
          </div>
        )}
      </div>
    );
  }

}

export default class ReactionDropdown extends React.PureComponent {

  static contextTypes = {
    router: PropTypes.object,
  };

  static propTypes = {
    children: PropTypes.node,
    icon: PropTypes.string,
    onReaction: PropTypes.func.isRequired,
    loading: PropTypes.bool,
    size: PropTypes.number,
    title: PropTypes.string,
    disabled: PropTypes.bool,
    status: ImmutablePropTypes.map,
    isUserTouching: PropTypes.func,
    onOpen: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    openDropdownId: PropTypes.number,
    openedViaKeyboard: PropTypes.bool,
  };

  static defaultProps = {
    title: 'Reaction',
  };

  state = {
    id: id++,
  };

  handlePickEmoji = (data) => {
    this.props.onReaction(this.props.status, data.native.replace(/:/g, ''));
  };

  handleClick = ({ type }) => {
    if (this.props.status.get('reacted')) {
      const reaction = this.props.status.get('reactions').find(x => x.get('me'));
      this.props.onReaction(this.props.status, reaction.get('name'));
    }

    if (this.props.status.get('reacted') || this.state.id === this.props.openDropdownId) {
      this.handleClose();
    } else {
      this.props.onOpen(this.state.id, this.handleItemClick, type !== 'click');
    }
  };

  handleClose = () => {
    if (this.activeElement) {
      this.activeElement.focus({ preventScroll: true });
      this.activeElement = null;
    }
    this.props.onClose(this.state.id);
  };

  handleMouseDown = () => {
    if (!this.state.open) {
      this.activeElement = document.activeElement;
    }
  };

  handleButtonKeyDown = (e) => {
    switch(e.key) {
    case ' ':
    case 'Enter':
      this.handleMouseDown();
      break;
    }
  };

  handleKeyPress = (e) => {
    switch(e.key) {
    case ' ':
    case 'Enter':
      this.handleClick(e);
      e.stopPropagation();
      e.preventDefault();
      break;
    }
  };

  setTargetRef = c => {
    this.target = c;
  };

  findTarget = () => {
    return this.target;
  };

  componentWillUnmount = () => {
    if (this.state.id === this.props.openDropdownId) {
      this.handleClose();
    }
  };

  close = () => {
    this.handleClose();
  };

  render () {
    const {
      icon,
      size,
      title,
      disabled,
      loading,
      openDropdownId,
      openedViaKeyboard,
      children,
      status,
    } = this.props;

    const open = this.state.id === openDropdownId;

    const button = children ? React.cloneElement(React.Children.only(children), {
      onClick: this.handleClick,
      onMouseDown: this.handleMouseDown,
      onKeyDown: this.handleButtonKeyDown,
      onKeyPress: this.handleKeyPress,
    }) : (
      <IconButton
        className='smile-o-icon'
        icon={icon}
        title={title}
        active={status.get('reacted')}
        disabled={disabled}
        size={size}
        onClick={this.handleClick}
        onMouseDown={this.handleMouseDown}
        onKeyDown={this.handleButtonKeyDown}
        onKeyPress={this.handleKeyPress}
      />
    );

    return (
      <React.Fragment>
        <span ref={this.setTargetRef}>
          {button}
        </span>
        <Overlay show={open} offset={[5, 5]} placement={'bottom'} flip target={this.findTarget} popperConfig={{ strategy: 'fixed' }}>
          {({ props, arrowProps, placement }) => (
            <div {...props}>
              <div className={`dropdown-animation dropdown-menu ${placement}`}>
                <div className={`dropdown-menu__arrow ${placement}`} {...arrowProps} />
                <ReactionDropdownMenu
                  loading={loading}
                  onPickEmoji={this.handlePickEmoji}
                  onClose={this.handleClose}
                  openedViaKeyboard={openedViaKeyboard}
                />
              </div>
            </div>
          )}
        </Overlay>
      </React.Fragment>
    );
  }

}
