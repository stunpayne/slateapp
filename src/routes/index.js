import { createDrawerNavigator, createStackNavigator, createAppContainer } from 'react-navigation';

import SplashScreen from '../screens/splash';
import HomeScreen from "../screens/home";
import LoginScreen from '../screens/login';
import IntroScreen from '../screens/intro';
import UserConfigurationScreen from '../screens/user_config';
import DrawerContainer from '../screens/drawer/index.js';

const MainNavigator = createStackNavigator({
  Splash: SplashScreen,
  Login: LoginScreen,
  Home: HomeScreen,
  Intro: IntroScreen,
  UserConfig: UserConfigurationScreen,
}, {
  initialRouteName: 'Splash',
  defaulfNavigationOptions: ({ navigation }) => ({
    headerTitleStyle: {
      textAlign: 'center',
      alignSelf: 'center',
      flex: 1,
    }
  })
});


const DrawerStack = createDrawerNavigator(
  {
    Main: MainNavigator
  },
  {
    drawerPosition: 'right',
    initialRouteName: 'Main',
    drawerWidth: 300,
    contentComponent: DrawerContainer,
    drawerLockMode: 'locked-closed',
  }
);


export default AppContainer = createAppContainer(DrawerStack);

// export default createAppContainer(MainNavigator);