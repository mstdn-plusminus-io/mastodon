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
  title: intl.formatMessage(state.getIn(['compose', 'spoiler']) ? messages.marked : messages.unmarked),
  cwActive: state.getIn(['compose', 'spoiler']),
  value,
  ariaControls: 'cw-spoiler-input',
});

export default @injectIntl
@connect(mapStateToProps)
class CustomSpoilerButtonContainer extends React.Component {

  static propTypes = {
    preset: PropTypes.string.isRequired,
    dispatch: PropTypes.func.isRequired,
    value: PropTypes.string.isRequired,
    cwActive: PropTypes.bool,
    active: PropTypes.bool,
    onChange: PropTypes.func.isRequired,
  };

  onClick = () => {
    const e = {
      target: {
        value: '',
      },
    };
    if (this.props.cwActive) {
      if (this.props.value !== this.props.preset) {
        e.target.value = this.props.preset;
        this.props.onChange(e);
      } else {
        this.props.dispatch(changeComposeSpoilerness());
      }
    } else {
      this.props.dispatch(changeComposeSpoilerness());
      e.target.value = this.props.preset;
      this.props.onChange(e);
    }
  };

  render() {
    const label = [...this.props.preset].slice(0, 2).join('');
    const active = this.props.cwActive && this.props.value === this.props.preset;
    return <TextIconButton {...this.props} label={label} active={active} onClick={this.onClick} />;
  }

}
