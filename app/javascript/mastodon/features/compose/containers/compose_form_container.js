import { connect } from 'react-redux';

import {
  changeCompose,
  submitCompose,
  clearComposeSuggestions,
  fetchComposeSuggestions,
  selectComposeSuggestion,
  changeComposeSpoilerText,
  insertEmojiCompose,
  uploadCompose,
  changeComposeVisibility,
  setMaxMediaAttachments,
  setImageMatrixLimit,
} from '../../../actions/compose';
import ComposeForm from '../components/compose_form';

const mapStateToProps = state => ({
  text: state.getIn(['compose', 'text']),
  suggestions: state.getIn(['compose', 'suggestions']),
  spoiler: state.getIn(['compose', 'spoiler']),
  spoilerText: state.getIn(['compose', 'spoiler_text']),
  privacy: state.getIn(['compose', 'privacy']),
  focusDate: state.getIn(['compose', 'focusDate']),
  caretPosition: state.getIn(['compose', 'caretPosition']),
  preselectDate: state.getIn(['compose', 'preselectDate']),
  isSubmitting: state.getIn(['compose', 'is_submitting']),
  isEditing: state.getIn(['compose', 'id']) !== null,
  isChangingUpload: state.getIn(['compose', 'is_changing_upload']),
  isUploading: state.getIn(['compose', 'is_uploading']),
  anyMedia: state.getIn(['compose', 'media_attachments']).size > 0,
  isInReply: state.getIn(['compose', 'in_reply_to']) !== null,
  lang: state.getIn(['compose', 'language']),
  maxChars: state.getIn(['server', 'server', 'configuration', 'statuses', 'max_characters'], 500),
});

let cachedKeywordVisibilities = null;

const mapDispatchToProps = (dispatch) => ({
  onInitialize(instance) {
    dispatch(setMaxMediaAttachments(instance.configuration.statuses.max_media_attachments));
    dispatch(setImageMatrixLimit(instance.configuration.media_attachments.image_matrix_limit));
  },

  onChange (text) {
    dispatch(changeCompose(text));

    if (localStorage.plusminus_config_keyword_based_visibility === 'enabled') {
      if (!cachedKeywordVisibilities) {
        cachedKeywordVisibilities = JSON.parse(localStorage.plusminus_config_keyword_based_visibilities);
      }
      const matched = cachedKeywordVisibilities.find((option) => text.includes(option.keyword));
      if (matched) {
        dispatch(changeComposeVisibility(matched.visibility));
      }
    }
  },

  onSubmit () {
    dispatch(submitCompose());
  },

  onClearSuggestions () {
    dispatch(clearComposeSuggestions());
  },

  onFetchSuggestions (token) {
    dispatch(fetchComposeSuggestions(token));
  },

  onSuggestionSelected (position, token, suggestion, path) {
    dispatch(selectComposeSuggestion(position, token, suggestion, path));
  },

  onChangeSpoilerText (checked) {
    dispatch(changeComposeSpoilerText(checked));

    if (localStorage.plusminus_config_keyword_based_visibility === 'enabled' && localStorage.plusminus_config_spoiler_keyword_based_visibility === 'enabled') {
      if (!cachedKeywordVisibilities) {
        cachedKeywordVisibilities = JSON.parse(localStorage.plusminus_config_keyword_based_visibilities);
      }
      const matched = cachedKeywordVisibilities.find((option) => checked.includes(option.keyword));
      if (matched) {
        dispatch(changeComposeVisibility(matched.visibility));
      }
    }
  },

  onPaste (files) {
    dispatch(uploadCompose(files));
  },

  onPickEmoji (position, data, needsSpace) {
    dispatch(insertEmojiCompose(position, data, needsSpace));
  },

});

export default connect(mapStateToProps, mapDispatchToProps)(ComposeForm);
