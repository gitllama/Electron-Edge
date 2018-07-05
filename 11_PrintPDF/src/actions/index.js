import { createActions } from 'redux-actions';

/*
{
  type: string;
  payload?: any;
  //error?: boolean;
  meta?: any;
}
*/

export default createActions(
  'STATE_CHANGE',
  'CHANGE_INC',
  'CHANGE_RUN',
  'CHANGE_INC_ASYNC',
  'COMMAND_MESSAGE',
);
