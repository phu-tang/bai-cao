import { Provider } from 'react-redux';
import React from 'react';
import Layout from './component/deck';

const App = ({ store }) => (
  <Provider store={store}>
    <div name="application">
      <Layout />
    </div>
  </Provider>
);

export default App;
