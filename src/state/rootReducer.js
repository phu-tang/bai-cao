import { always } from 'lodash/fp';
import { combineReducers } from 'redux';
import { reducers as apiCalls } from 'redux-api-call';
import deck from '../component/deck/state';

const VERSION = process.env.REACT_APP_VERSION || 'DEVELOPMENT';

export default combineReducers({
  version: always(VERSION),
  ...deck,
  ...apiCalls,
});
