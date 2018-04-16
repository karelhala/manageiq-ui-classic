import { addReducer, applyReducerHash } from '../miq-redux/reducer';
import FUNCTION_MAPPER from './report-data-reducer';

// Feel free to add your own function mappers and new reducer functions
const reducersHash = {
  ...FUNCTION_MAPPER,
}

export default function bootstrapReducers() {
  addReducder(
    state, action => applyReducerHash(reducersHash, state, action)
  );
  // Feel free to add your own addReducer function
}
