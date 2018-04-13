import { REFRESH_EVENT } from '../miq-redux/action-types';

const API = angular.injector(['ng', 'miq.api']).get('API');
const API_ENDPOINT = 'api';

export function customActionRefresh(payload, resources) {
  throw new Error('customAction refresh not yet implemented!');
}

export function APIRefresh(entity, resources) {
  return API.post(`/${API_ENDPOINT}/${entity}`, {
    action: REFRESH_EVENT,
    resources,
  })
  .then((data) => {
    if (data.results && data.results.length > 0 && data.results[0].success) {
      const msg = sprintf(__('Requested refresh of selected items.'));
      add_flash(msg, 'success');
    } else {
      const msg = sprintf(__('Requested refresh of selected item.'));
      add_flash(msg, 'error');
    }
    return data;
  })
  .catch((data) => {
    // add_flash(sprintf(__('Requested refresh failed.')), 'error');
    return data;
  });
}

export function onRefresh(state, action) {
  if (action.payload.customAction) {
    customActionRefresh(action.payload, state.gridChecks);
  } else {
    APIRefresh(action.payload.entity, state.gridChecks);
  }
  return {...state};
}
