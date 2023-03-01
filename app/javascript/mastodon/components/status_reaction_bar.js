import React from 'react';
import ImmutablePureComponent from 'react-immutable-pure-component';
import ImmutablePropTypes from 'react-immutable-proptypes';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { autoPlayGif, reduceMotion } from 'mastodon/initial_state';
import unicodeMapping from 'mastodon/features/emoji/emoji_unicode_mapping_light';
import classNames from 'classnames';
import AnimatedNumber from 'mastodon/components/animated_number';
import TransitionMotion from 'react-motion/lib/TransitionMotion';
import spring from 'react-motion/lib/spring';
import { assetHost } from 'mastodon/utils/config';

class Emoji extends React.PureComponent {

  static propTypes = {
    emoji: PropTypes.string.isRequired,
    emojiMap: ImmutablePropTypes.map.isRequired,
    hovered: PropTypes.bool.isRequired,
    remote: PropTypes.bool.isRequired,
    url: PropTypes.string,
    static_url: PropTypes.string,
  };

  render () {
    const { emoji, emojiMap, hovered, remote, url, static_url } = this.props;

    if (unicodeMapping[emoji]) {
      const { filename, shortCode } = unicodeMapping[this.props.emoji];
      const title = shortCode ? `:${shortCode}:` : '';

      return (
        <img
          draggable='false'
          className='emojione'
          alt={emoji}
          title={title}
          src={`${assetHost}/emoji/${filename}.svg`}
          loading='lazy'
          decoding='async'
        />
      );
    } else if (remote) {
      const filename  = (autoPlayGif || hovered) ? url : static_url;
      const shortCode = `:${emoji}:`;

      return (
        <img
          draggable='false'
          className='emojione custom-emoji'
          alt={shortCode}
          title={shortCode}
          src={filename}
          loading='lazy'
          decoding='async'
        />
      );
    } else if (emojiMap.get(emoji)) {
      const filename  = (autoPlayGif || hovered) ? emojiMap.getIn([emoji, 'url']) : emojiMap.getIn([emoji, 'static_url']);
      const shortCode = `:${emoji}:`;

      return (
        <img
          draggable='false'
          className='emojione custom-emoji'
          alt={shortCode}
          title={shortCode}
          src={filename}
          loading='lazy'
          decoding='async'
        />
      );
    } else {
      return null;
    }
  }

}

class Reaction extends ImmutablePureComponent {

  static propTypes = {
    status: ImmutablePropTypes.map.isRequired,
    reaction: ImmutablePropTypes.map.isRequired,
    addReaction: PropTypes.func.isRequired,
    removeReaction: PropTypes.func.isRequired,
    emojiMap: ImmutablePropTypes.map.isRequired,
    style: PropTypes.object,
  };

  state = {
    hovered: false,
  };

  handleClick = () => {
    const { reaction, status, addReaction, removeReaction } = this.props;

    if (status.get('reacted')) {
      removeReaction(status, reaction.get('name'));
    } else {
      addReaction(status, reaction.get('name'));
    }
  };

  handleMouseEnter = () => this.setState({ hovered: true });

  handleMouseLeave = () => this.setState({ hovered: false });

  render () {
    const { reaction } = this.props;

    let shortCode = reaction.get('name');

    if (unicodeMapping[shortCode]) {
      shortCode = unicodeMapping[shortCode].shortCode;
    }

    return (
      <button className={classNames('status-reaction-bar__item', { active: reaction.get('me') })} disabled={reaction.get('remote')} onClick={this.handleClick} onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleMouseLeave} title={`:${shortCode}:`} style={this.props.style}>
        <span className='status-reaction-bar__item__emoji'><Emoji hovered={this.state.hovered} emoji={reaction.get('name')} emojiMap={this.props.emojiMap} remote={reaction.get('remote')} url={reaction.get('url')} static_url={reaction.get('static_url')} /></span>
        <span className='status-reaction-bar__item__count'><AnimatedNumber value={reaction.get('count')} /></span>
      </button>
    );
  }

}

export default @injectIntl
class StatusReactionBar extends ImmutablePureComponent {

  static propTypes = {
    status: ImmutablePropTypes.map.isRequired,
    addReaction: PropTypes.func.isRequired,
    removeReaction: PropTypes.func.isRequired,
    emojiMap: ImmutablePropTypes.map.isRequired,
  };

  willEnter () {
    return { scale: reduceMotion ? 1 : 0 };
  }

  willLeave () {
    return { scale: reduceMotion ? 0 : spring(0, { stiffness: 170, damping: 26 }) };
  }

  render () {
    const status = this.props.status;

    const reactions = status.get('reactions');
    const visibleReactions = reactions.filter(x => x.get('count') > 0);

    const styles = visibleReactions.map(reaction => ({
      key: reaction.get('name'),
      data: reaction,
      style: { scale: reduceMotion ? 1 : spring(1, { stiffness: 150, damping: 13 }) },
    })).toArray();

    return (
      <TransitionMotion styles={styles} willEnter={this.willEnter} willLeave={this.willLeave}>
        {items => (
          <div className={classNames('status-reaction-bar', { 'status-reaction-bar--empty': visibleReactions.isEmpty() })}>
            {items.map(({ key, data, style }) => (
              <Reaction
                key={key}
                reaction={data}
                style={{ transform: `scale(${style.scale})`, position: style.scale < 0.5 ? 'absolute' : 'static' }}
                status={status}
                addReaction={this.props.addReaction}
                removeReaction={this.props.removeReaction}
                emojiMap={this.props.emojiMap}
              />
            ))}
          </div>
        )}
      </TransitionMotion>
    );
  }

}
