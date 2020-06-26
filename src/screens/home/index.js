import React, { Component } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import MenuImage from "../../components/menu_image";
import { GoogleSignin } from '@react-native-community/google-signin';

class HomeScreen extends Component {

  static navigationOptions = ({ navigation }) => ({
    title: 'Home',
    headerLeft: (
      <MenuImage
        onPress={() => {
          console.log("menu image pressed");
          // navigation.openDrawer();
        }}
      />
    )
  });

  revokeAccess = async () => {
    try {
      await GoogleSignin.revokeAccess();
      this.props.navigation.navigate("Login");
      console.log('deleted');
    } catch (error) {
      console.error(error);
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <Text>
          HomeScreen Component
        </Text>

        <TouchableOpacity
          style={styles.button}
          onPress={this.revokeAccess}
        >
          <Text>Logout</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

export default HomeScreen;

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
});