import React, { Component } from 'react';
import { View } from 'react-native';
import { storeData, retrieveData } from '../../config/storage';
import { SKIP_INTRODUCTION } from '../../constants';
import Swiper from 'react-native-animated-swiper';
import { NavigationActions, StackActions } from 'react-navigation';
import SlideOne from './pages/slide1';
import SlideTwo from './pages/slide2';
import SlideThree from './pages/slide3';
import SlideFour from './pages/slide4';
import { styles } from './introStyles';

class IntroScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      header: () => null
    }
  };

  navigateLogin = () => {
    const resetAction = StackActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({ routeName: 'Login' })],
    });
    this.props.navigation.dispatch(resetAction);
  };

  onSubmit = () => {
    storeData(SKIP_INTRODUCTION, "true");
    this.navigateLogin();
    this.props.navigation.state.params._handleGoogleSigninConfig();
  };

  render() {
    return (
      <View style={styles.container}>
        <Swiper
          backgroundColor={['#4285f4', '#0f9d58', '#f4b400', '#db4437']}
          dots
          dotsColor="rgba(255, 255, 255, 0.25)"
          dotsColorActive="rgba(255, 255, 255, 0.75)">
          <SlideOne />
          <SlideTwo />
          <SlideThree />
          <SlideFour onSubmit={this.onSubmit} />
        </Swiper>
      </View>
    );
  }
};


export default IntroScreen;

