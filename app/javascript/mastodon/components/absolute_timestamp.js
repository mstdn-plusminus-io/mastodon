import React from 'react';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';

const dateFormatOptions = {
  hour12: false,
  year: 'numeric',
  month: 'short',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
};

export default @injectIntl
class AbsoluteTimestamp extends React.PureComponent {

  static propTypes = {
    intl: PropTypes.object.isRequired,
    timestamp: PropTypes.string.isRequired,
  };

  render () {
    const { timestamp, intl } = this.props;

    const date = new Date(timestamp);
    const now = new Date();
    let timeString = date.toLocaleTimeString();
    if (date.toLocaleDateString() !== now.toLocaleDateString()) {
      timeString = `${date.toLocaleDateString()} ${timeString}`;
    }

    return (
      <time dateTime={timestamp} title={intl.formatDate(date, dateFormatOptions)}>
        {timeString}
      </time>
    );
  }

}
