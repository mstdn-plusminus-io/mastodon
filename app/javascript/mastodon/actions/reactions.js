import api, { getLinks } from '../api';
import { importFetchedStatuses } from './importer';

export const REACTED_STATUSES_FETCH_REQUEST = 'REACTED_STATUSES_FETCH_REQUEST';
export const REACTED_STATUSES_FETCH_SUCCESS = 'REACTED_STATUSES_FETCH_SUCCESS';
export const REACTED_STATUSES_FETCH_FAIL    = 'REACTED_STATUSES_FETCH_FAIL';

export const REACTED_STATUSES_EXPAND_REQUEST = 'REACTED_STATUSES_EXPAND_REQUEST';
export const REACTED_STATUSES_EXPAND_SUCCESS = 'REACTED_STATUSES_EXPAND_SUCCESS';
export const REACTED_STATUSES_EXPAND_FAIL    = 'REACTED_STATUSES_EXPAND_FAIL';

export function fetchReactedStatuses() {
  return (dispatch, getState) => {
    if (getState().getIn(['status_lists', 'reactions', 'isLoading'])) {
      return;
    }

    dispatch(fetchReactedStatusesRequest());

    api(getState).get('/api/v1/reactions').then(response => {
      const next = getLinks(response).refs.find(link => link.rel === 'next');
      dispatch(importFetchedStatuses(response.data));
      dispatch(fetchReactedStatusesSuccess(response.data, next ? next.uri : null));
    }).catch(error => {
      dispatch(fetchReactedStatusesFail(error));
    });
  };
}

export function fetchReactedStatusesRequest() {
  return {
    type: REACTED_STATUSES_FETCH_REQUEST,
    skipLoading: true,
  };
}

export function fetchReactedStatusesSuccess(statuses, next) {
  return {
    type: REACTED_STATUSES_FETCH_SUCCESS,
    statuses,
    next,
    skipLoading: true,
  };
}

export function fetchReactedStatusesFail(error) {
  return {
    type: REACTED_STATUSES_FETCH_FAIL,
    error,
    skipLoading: true,
  };
}

export function expandReactedStatuses() {
  return (dispatch, getState) => {
    const url = getState().getIn(['status_lists', 'reactions', 'next'], null);

    if (url === null || getState().getIn(['status_lists', 'reactions', 'isLoading'])) {
      return;
    }

    dispatch(expandReactedStatusesRequest());

    api(getState).get(url).then(response => {
      const next = getLinks(response).refs.find(link => link.rel === 'next');
      dispatch(importFetchedStatuses(response.data));
      dispatch(expandReactedStatusesSuccess(response.data, next ? next.uri : null));
    }).catch(error => {
      dispatch(expandReactedStatusesFail(error));
    });
  };
}

export function expandReactedStatusesRequest() {
  return {
    type: REACTED_STATUSES_EXPAND_REQUEST,
  };
}

export function expandReactedStatusesSuccess(statuses, next) {
  return {
    type: REACTED_STATUSES_EXPAND_SUCCESS,
    statuses,
    next,
  };
}

export function expandReactedStatusesFail(error) {
  return {
    type: REACTED_STATUSES_EXPAND_FAIL,
    error,
  };
}
