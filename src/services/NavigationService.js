import { NavigationActions, StackActions } from 'react-navigation';

let _navigator;

function setTopLevelNavigator(navigatorRef) {
  _navigator = navigatorRef;
}

function navigate(routeName, params, action) {
  _navigator.dispatch(
    NavigationActions.navigate({
      routeName,
      params,
      action
    })
  );
}

function navigateReset(routeName, params) {
  _navigator.dispatch(
    StackActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({
          routeName,
          params,
        }),
      ],
    }),
  );
}

// add other navigation functions that you need and export them

export default {
  navigateReset,
  navigate,
  setTopLevelNavigator,
};