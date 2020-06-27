import React, { Component } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { storeData, retrieveData } from '../../config/storage';
import { SKIP_INTRODUCTION } from '../../constants';

class IntroScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      header: () => null
    }
  };

  onSubmit = () => {
    storeData(SKIP_INTRODUCTION, "true");
    this.props.navigation.navigate("Login");
  };

  render() {
    return (
      <View style={styles.container}>
        <Text>
          IntroScreen Component
        </Text>

        <TouchableOpacity
          style={styles.button}
          onPress={this.onSubmit}
        >
          <Text>GET STARTED</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

export default IntroScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ce7d65'
  },
  button: {
    alignItems: "center",
    backgroundColor: "#ef6b91",
    padding: 10
  },
});