import { GRID_CHECK_CHANGE, GRID_CHECK_RESET } from '../miq-redux/action-types';

export function gridCheckChange(state, payload) {
  console.log('gridCheckChange', payload);
  return {...state};
}

export function gridCheckReset(state, payload) {
  console.log('gridCheckReset', payload);
  return {...state};
}

export default const FUNCTION_MAPPER = {
  [GRID_CHECK_CHANGE]: (state, action) => gridCheckChange(state, action.payload),
  [GRID_CHECK_RESET]: (state, action) => gridCheckReset(state, action.payload),
};
