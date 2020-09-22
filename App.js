import React from 'react';
import { Provider } from 'react-redux';
import { store, persistor } from './src/redux/store';
import AppNavigator from './src/routes';
import { createAppContainer } from 'react-navigation';
import NavigationService from './src/services/NavigationService';
import { PersistGate } from 'redux-persist/integration/react';


const AppContainer = createAppContainer(AppNavigator);

class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <AppContainer
            ref={navigatorRef => {
              NavigationService.setTopLevelNavigator(navigatorRef);
            }}
          />
        </PersistGate>
      </Provider>
    );
  }
}

export default App;
