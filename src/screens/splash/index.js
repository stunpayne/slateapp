import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { storeData, retrieveData } from '../../config/storage';
import { SKIP_INTRODUCTION } from '../../constants';

class SplashScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      header: () => null
    }
  }

  componentWillMount() {
    setTimeout(() => {
      retrieveData(SKIP_INTRODUCTION).then((value) => {
        if (!value) {
          this.props.navigation.navigate('Intro');
        } else if (value) {
          this.props.navigation.navigate('Login');
        }
      });
    }, 1000);
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>
          SplashScreen Component
        </Text>
      </View>
    );
  }
}

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2cd18a'
  },
});