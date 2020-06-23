import { createDrawerNavigator, createStackNavigator, createAppContainer } from 'react-navigation';

import SplashScreen from '../screens/splash';
import HomeScreen from "../screens/home";
import LoginScreen from '../screens/login';
// import DrawerContainer from '../screens/drawer/index.js';

const MainNavigator = createStackNavigator({
  Splash:SplashScreen,
  Login:LoginScreen,
  Home:HomeScreen
}, {
  initialRouteName: 'Splash',
  defaulfNavigationOptions: ({ navigation }) => ({
    headerTitleStyle: {
      fontWeight: 'bold',
      textAlign: 'center',
      alignSelf: 'center',
      flex: 1,
      fontFamily: 'FallingSkyCond'
    }
  })
});


// const DrawerStack = createDrawerNavigator(
//   {
//     Main: MainNavigator
//   },
//   {
//     drawerPosition: 'left',
//     initialRouteName: 'Main',
//     drawerWidth: 250,
//     contentComponent: DrawerContainer
//   }
// );


export default createAppContainer(MainNavigator);