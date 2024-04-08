import { injectIntl } from 'react-intl';

import { withRouter } from 'react-router-dom';

import { connect } from 'react-redux';

import { Quote } from '../components/quote';
import { makeGetStatus } from '../selectors';

const makeMapStateToProps = () => {
  const getStatus = makeGetStatus();

  const mapStateToProps = (state, props) => ({
    status: getStatus(state, props),
  });

  return mapStateToProps;
};

export default injectIntl(connect(makeMapStateToProps)(withRouter(Quote)));
