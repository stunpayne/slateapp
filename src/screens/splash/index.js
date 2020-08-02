import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { SIGNIN_SCOPE1, SIGNIN_SCOPE2, WEB_CLIENT_ID } from 'react-native-dotenv';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-community/google-signin';
import { connect } from 'react-redux';
import { createFetchSlateUser } from '../../redux/actions/authActions';
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
          // User screens didnt see intro yet
          this.props.navigation.navigate('Intro', { _handleGoogleSigninConfig: () => this._handleGoogleSigninConfig() });
        } else if (value) {
          // User saw intro screens
          this._handleGoogleSigninConfig();
        }
      });
    }, 5000);
  };

  _handleGoogleSigninConfig() {
    // initial configuration
    GoogleSignin.configure({
      //It is mandatory to call this method before attempting to call signIn()
      scopes: [SIGNIN_SCOPE1, SIGNIN_SCOPE2],
      // Repleace with your webClientId generated from Firebase console
      webClientId: WEB_CLIENT_ID
    });
    //Check if user is already signed in
    this._isSignedIn();
  };

  _isSignedIn = async () => {
    const isSignedIn = await GoogleSignin.isSignedIn();
    if (isSignedIn) {
      // alert('User is already signed in');
      //Get the User details as user is already signed in
      this._getCurrentUserInfo();
    } else {
      //alert("Please Login");
      console.log('Please Login');
      this.props.navigation.navigate('Login');
    }
  };

  _getCurrentUserInfo = async () => {
    try {
      const userInfo = await GoogleSignin.signInSilently();
      // console.log('User Info --> ', userInfo);
      this.props.createFetchSlateUser(userInfo);
    } catch (error) {
      this.props.navigation.navigate('Login');
      if (error.code === statusCodes.SIGN_IN_REQUIRED) {
        console.log('User has not signed in yet');
      } else {
        console.log("Something went wrong. Unable to get user's info");
      }
    }
  };

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

const mapStateToProps = state => ({
});

export default connect(mapStateToProps, { createFetchSlateUser })(SplashScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2cd18a'
  },
});