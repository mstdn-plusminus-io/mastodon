import { connect } from 'react-redux';

import { cancelReplyCompose } from '../../../actions/compose';
import { makeGetStatus } from '../../../selectors';
import QuoteIndicator from '../components/quote_indicator';

const makeMapStateToProps = () => {
  const getStatus = makeGetStatus();

  const mapStateToProps = state => {
    let statusId = state.getIn(['compose', 'id'], null);
    let editing  = true;

    if (statusId === null) {
      statusId = state.getIn(['compose', 'quote_id']);
      editing  = false;
    }

    return {
      status: getStatus(state, { id: statusId }),
      editing,
    };
  };

  return mapStateToProps;
};

const mapDispatchToProps = dispatch => ({

  onCancel () {
    dispatch(cancelReplyCompose());
  },

});

export default connect(makeMapStateToProps, mapDispatchToProps)(QuoteIndicator);
