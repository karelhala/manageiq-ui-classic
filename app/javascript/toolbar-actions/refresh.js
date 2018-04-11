import { REFRESH_EVENT } from '../helpers/rxConnector';

const API = angular.injector(['ng', 'miq.api']).get('API');
const API_ENDPOINT = 'api';

export function customActionRefresh(payload, resources) {
  throw new Error('customAction refresh not yet implemented!');
}

export function APIRefresh(entity, resources) {
  API.post(`/${API_ENDPOINT}/${entity}`, {
    action: REFRESH_EVENT,
    resources,
  })
  .then((data) => {
    if (data.results.length > 1) {
      add_flash(sprintf(__('Requested refresh of selected items.')), 'success');
    } else {
      add_flash(sprintf(__('Requested refresh of selected item.')), 'success');
    }
  })
  .catch((data) => {
    add_flash(sprintf(__('Requested refresh failed.')), 'error');
  });
}

export function onRefresh(payload, resources) {
  if (payload.customAction) {
    customActionRefresh(payload, resources);
  } else {
    APIRefresh(payload.entity, resources);
  }
}
