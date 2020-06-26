import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';

class SplashScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      header: () => null
    }
  }

  componentWillMount() {
    setTimeout(() => {
      this.props.navigation.navigate('Login')
    }, 1500);
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