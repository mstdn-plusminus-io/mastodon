import TextIconButton from '../components/text_icon_button';
import IconButton from '../../../components/icon_button';
import React from 'react';
import PropTypes from 'prop-types';

const iconStyle = {
  height: null,
  lineHeight: '27px',
};

export default class ComposeExtensionButtonContainer extends React.Component {

  static propTypes = {
    label: PropTypes.string,
    icon: PropTypes.string,
    onClick: PropTypes.func.isRequired,
    active: PropTypes.bool,
  };

  render() {
    if (this.props.icon) {
      return <IconButton {...this.props} className={'text-icon-button'} style={iconStyle} onClick={this.props.onClick} />;
    }
    return <TextIconButton {...this.props} onClick={this.props.onClick} />;
  }

}
