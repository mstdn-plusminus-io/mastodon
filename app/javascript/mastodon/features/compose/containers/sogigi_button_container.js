import { connect } from 'react-redux';
import TextIconButton from '../components/text_icon_button';
import { changeComposeSpoilerness, changeComposeSpoilerText } from '../../../actions/compose';
import { injectIntl, defineMessages } from 'react-intl';
import React from 'react';
import PropTypes from 'prop-types';

const messages = defineMessages({
  marked: { id: 'compose_form.spoiler.marked', defaultMessage: 'Text is hidden behind warning' },
  unmarked: { id: 'compose_form.spoiler.unmarked', defaultMessage: 'Text is not hidden' },
});

const mapStateToProps = (state, { intl, value }) => ({
  label: 'そぎ',
  title: intl.formatMessage(state.getIn(['compose', 'spoiler']) ? messages.marked : messages.unmarked),
  cwActive: state.getIn(['compose', 'spoiler']),
  active: state.getIn(['compose', 'spoiler']) && value === 'そぎぎ',
  ariaControls: 'cw-spoiler-input',
});

export default @injectIntl
@connect(mapStateToProps)
class SogigiButtonContainer extends React.Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    value: PropTypes.string.isRequired,
    cwActive: PropTypes.bool,
    active: PropTypes.bool,
  };

  onClick() {
    if (this.props.cwActive) {
      if (this.props.value !== 'そぎぎ') {
        this.props.dispatch(changeComposeSpoilerText('そぎぎ'));
      } else {
        this.props.dispatch(changeComposeSpoilerness());
      }
    } else {
      this.props.dispatch(changeComposeSpoilerness());
      this.props.dispatch(changeComposeSpoilerText('そぎぎ'));
    }
  }

  render() {
    return <TextIconButton {...this.props} onClick={() => this.onClick()} />;
  }

}
