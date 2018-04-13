
import { DELETE_EVENT, REFRESH_EVENT } from '../miq-redux/action-types'
import { onDelete } from '../toolbar-actions/delete';
import { onRefresh } from '../toolbar-actions/refresh';
import { applyReducerHash, addReducer } from '../miq-redux/reducer';

function transformResource(resource) {
  return ({ id: resource });
}

function gridChecksForCallback(state, action, callback) {
  let gridChecks;
  if (!Object.prototype.hasOwnProperty('gridChecks')) {
    state.gridChecks = getGridChecks();
  }
  return callback(state, action);
}

export function getGridChecks() {
  if (ManageIQ.gridChecks.length === 0) {
    return [ManageIQ.record.recordId].map(transformResource);
  }
  return ManageIQ.gridChecks.map(transformResource);
}

/**
 * Function event mapper for observed Redux.
 * For action:
 *     {type: 'example', payload: {...}}
 * You need to add:
 *     example: (state, action) => gridChecksForCallback(state, action, exampleFunction)
 * Where exampleFunction is you function which is triggered whenever new action is dispatched 
 * to redux with action type 'example'.
 */
const eventMapper = {
  [DELETE_EVENT]: (state, action) => gridChecksForCallback(state, action, onDelete),
  [REFRESH_EVENT]: (state, action) => gridChecksForCallback(state, action, onRefresh),
};

addReducer((state, action) => applyReducerHash(eventMapper, state, action));
