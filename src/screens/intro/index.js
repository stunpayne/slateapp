import React, { Component } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { storeData, retrieveData } from '../../config/storage';
import { SKIP_INTRODUCTION } from '../../constants';
import Swiper from 'react-native-animated-swiper';

class IntroScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      header: () => null
    }
  };

  onSubmit = () => {
    storeData(SKIP_INTRODUCTION, "true");
    this.props.navigation.navigate("Login");
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
          <Slide title="First slide" />
          <Slide title="second slide" />
          <Slide title="third slide" />
          <Lastslide title="last slide" onSubmit={this.onSubmit} />
        </Swiper>
      </View>
    );
  }
};

const Slide = ({ title }) => (
  <View style={styles.slide}>
    <Text style={styles.title}>{title}</Text>
  </View>
);

const Lastslide = ({ title, onSubmit }) => (
  <View style={styles.slide}>
    <Text style={styles.title}>{title}</Text>
    <TouchableOpacity
      style={styles.button}
      onPress={onSubmit}
    >
      <Text>GET STARTED</Text>
    </TouchableOpacity>
  </View>
);

export default IntroScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    alignItems: "center",
    backgroundColor: "#ef6b91",
    padding: 10
  },
  slide: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#ce7d65'
  },
  title: {
    color: '#fff',
    fontSize: 48
  }
});