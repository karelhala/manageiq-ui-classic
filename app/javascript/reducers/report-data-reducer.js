import { GRID_CHECK_CHANGE, GRID_CHECK_RESET } from '../miq-redux/action-types';
import { sendDataWithRx } from '../miq_observable';
import { pull } from 'lodash';

function rowClicked(checkedIds, rowSelect) {
  pull(checkedIds, rowSelect.id);
  if (rowSelect.checked) {
    checkedIds.push(rowSelect.id);
  }
  return checkedIds;
}

export function gridCheckChange(state, payload) {
  sendDataWithRx({rowSelect: payload.rowSelect});
  state.gridChecks = rowClicked(state.gridChecks || [], payload.rowSelect);
  state.globalGridChecks = rowClicked(state.globalGridChecks || [], payload.rowSelect);
  return {...state};
}

export function gridCheckReset(state, payload) {
  sendDataWithRx({setCount: 0});
  if (payload.global) {
    state.globalGridChecks = [];
  }
  state.gridChecks = [];
  return {...state};
}

const FUNCTION_MAPPER = {
  [GRID_CHECK_CHANGE]: (state, action) => gridCheckChange(state, action.payload),
  [GRID_CHECK_RESET]: (state, action) => gridCheckReset(state, action.payload),
};

export default FUNCTION_MAPPER;
