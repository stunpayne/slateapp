import React from 'react';
import { Provider } from 'react-redux';
import { store } from './src/redux/store';
import AppNavigator from './src/routes';
import { createAppContainer } from 'react-navigation';
import NavigationService from './src/services/NavigationService';


const AppContainer = createAppContainer(AppNavigator);

class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <AppContainer
          ref={navigatorRef => {
            NavigationService.setTopLevelNavigator(navigatorRef);
          }}
        />
      </Provider>
    );
  }
}

export default App;
