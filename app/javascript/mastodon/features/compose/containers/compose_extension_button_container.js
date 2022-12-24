import TextIconButton from '../components/text_icon_button';
import React from 'react';
import PropTypes from 'prop-types';

export default class ComposeExtensionButtonContainer extends React.Component {

  static propTypes = {
    label: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
  };

  render() {
    return <TextIconButton {...this.props} label={this.props.label} onClick={this.props.onClick} />;
  }

}
