import React, { Component } from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import { SIGNIN_SCOPE1, SIGNIN_SCOPE2, WEB_CLIENT_ID } from 'react-native-dotenv';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-community/google-signin';
import { connect } from 'react-redux';
import { setCurrentUserInfo, createFetchSlateUser } from '../../redux/actions/authActions';
import { styles } from './loginStyles';
import { Images } from '../../theme'

class LoginScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      header: () => null
    }
  };

  constructor(props) {
    super(props);
    this.state = {
      isLoading: false
    };
  };

  componentDidMount() {
    // // initial configuration
    // GoogleSignin.configure({
    //   //It is mandatory to call this method before attempting to call signIn()
    //   scopes: [SIGNIN_SCOPE1,SIGNIN_SCOPE2],
    //   // Repleace with your webClientId generated from Firebase console
    //   webClientId: WEB_CLIENT_ID
    // });
    //Check if user is already signed in
    this._isSignedIn();
  }

  _isSignedIn = async () => {
    const isSignedIn = await GoogleSignin.isSignedIn();
    if (isSignedIn) {
      // alert('User is already signed in');
      //Get the User details as user is already signed in
      this._getCurrentUserInfo();
    } else {
      //alert("Please Login");
      console.log('Please Login');
    }
    this.setState({ isLoading: false });
  };

  _getCurrentUserInfo = async () => {
    try {
      const userInfo = await GoogleSignin.signInSilently();
      // console.log('User Info --> ', userInfo);
      this.props.createFetchSlateUser(userInfo);
      // this.props.navigation.navigate("Home");
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_REQUIRED) {
        console.log('User has not signed in yet');
      } else {
        console.log("Something went wrong. Unable to get user's info");
      }
    }
  };

  _signIn = async () => {
    try {
      this.setState({ isLoading: true })
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      this.props.createFetchSlateUser(userInfo);
      // console.log('User Info --> ', userInfo);
      this.setState({ isLoading: false });
      // this.props.navigation.navigate("Home");
    } catch (error) {
      this.setState({ isLoading: false });
      console.log('Message', error.message);
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log('User Cancelled the Login Flow');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log('Signing In');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log('Play Services Not Available or Outdated');
      } else {
        console.log('Some Other Error Happened');
      }
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>
          Log In
        </Text>
        <View style={styles.logoContainer}>
          <Image
            style={styles.logo}
            source={Images.slate_icon_light}
          />
        </View>
        <Text style={styles.description}>
          Sign in with
        </Text>
        <GoogleSigninButton
          style={{ width: 192, height: 48 }}
          size={GoogleSigninButton.Size.Wide}
          color={GoogleSigninButton.Color.Dark}
          onPress={this._signIn}
          disabled={this.state.isLoading && this.props.isLoading}
        />

        <Text style={styles.termsText}>
          By signing in to Slate, you agree to the Terms of Service and Privacy Policy
        </Text>
      </View>
    );
  }
};

const mapStateToProps = state => ({
  isLoading: state.auth.isLoading
});

export default connect(mapStateToProps, { setCurrentUserInfo, createFetchSlateUser })(LoginScreen);