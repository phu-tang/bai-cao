import { applyMiddleware, createStore, compose } from 'redux';
import { compact } from 'lodash/fp';
import rootReducer from './rootReducer';
import apiMiddleware from './api';

const enhancers = compact([
  applyMiddleware(apiMiddleware),
  // autoRehydrate(),
  // eslint-disable-next-line no-underscore-dangle
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
]);

export default () => {
  const store = createStore(rootReducer, {}, compose(...enhancers));

  if (module.hot) {
    module.hot.accept('./rootReducer', () => {
      // eslint-disable-next-line global-require
      const nextReducer = require('./rootReducer').default;
      console.log('nextReducer', nextReducer);
      store.replaceReducer(nextReducer());
    });
  }

  return store;
};
