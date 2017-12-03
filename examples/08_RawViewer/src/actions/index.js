//Actions
import { createActions } from 'redux-actions';

export default createActions(
  'REDUCER_CHANGE',

  'READ_FILE_ASYNC',
  'REFLASH_ASYNC',
  'CHANGE_PARAMS_ASYNC', //param変更かけてから手動にしても良い
  'CHANGE_PARAMS',
  'CHANGE_SIZE',
  'CHANGE_TYPE'
);
