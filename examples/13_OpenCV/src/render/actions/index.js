import { createActions } from 'redux-actions';

export default createActions(
  'REDUCER_CHANGE',

  'READ_FILE_ASYNC',
  'REFLASH_ASYNC',

  'CHANGE_PARAMS',
  'CHANGE_SIZE',
  'CHANGE_TYPE',

  'WRITE_MESSAGE',
  'EXPORT_CSV',
);
