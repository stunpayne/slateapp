/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

// console.disableYellowBox = true;
// console.warn = () => {};
// Hold a reference to the original function so that it can be called later
const originalWarn = console.warn;

console.warn = (message, ...optionalParams) => {
  // Insure that we don't try to perform any string-only operations on
  // a non-string type:
  if (typeof message === 'string') {
    // Check if the message contains the blacklisted substring
    if (/Animated: `useNativeDriver` was not specified./g.test(message))
    {
      // Don't log the value
      return;
    }
  }

  // Otherwise delegate to the original 'console.warn' function
  originalWarn(message, ...optionalParams);
};

AppRegistry.registerComponent(appName, () => App);
