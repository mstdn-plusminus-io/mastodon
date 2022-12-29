import { connect } from 'react-redux';
import { openModal, closeModal } from '../../../actions/modal';
import { isUserTouching } from '../../../is_mobile';
import EmotionalDropdown from '../components/emotional_dropdown';

const mapStateToProps = state => ({
});

const mapDispatchToProps = dispatch => ({

  isUserTouching,
  onModalOpen: props => dispatch(openModal('ACTIONS', props)),
  onModalClose: () => dispatch(closeModal()),

});

export default connect(mapStateToProps, mapDispatchToProps)(EmotionalDropdown);
