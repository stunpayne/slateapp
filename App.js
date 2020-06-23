import React from 'react';
import AppContainer from "./src/routes";
import { Provider } from 'react-redux';
import { store } from './src/redux/store';

class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <AppContainer />
      </Provider>
    );
  }
}

export default App;
