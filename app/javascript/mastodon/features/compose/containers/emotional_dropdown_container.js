import { connect } from 'react-redux';

import { openModal, closeModal } from '../../../actions/modal';
import { isUserTouching } from '../../../is_mobile';
import EmotionalDropdown from '../components/emotional_dropdown';

const mapStateToProps = () => ({
});

const mapDispatchToProps = dispatch => ({

  isUserTouching,
  onModalOpen: props => dispatch(openModal({
    modalType: 'ACTIONS',
    modalProps: props,
  })),
  onModalClose: () => dispatch(closeModal({
    modalType: undefined,
    ignoreFocus: false,
  })),

});

export default connect(mapStateToProps, mapDispatchToProps)(EmotionalDropdown);
