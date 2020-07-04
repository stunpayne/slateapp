import { SET_CURRENT_USER, LOGOUT_USER } from '../types';
import { GoogleSignin } from '@react-native-community/google-signin';


export function setCurrentUserInfo(info, tokens) {
  return {
    type: SET_CURRENT_USER,
    info: info    
  };
};

export function logoutUser() {
  return {
    type: LOGOUT_USER
  };
};

export const _signOut = () => async dispatch => {
  //Remove user session from the device.
  console.log("Signout presed");
  try {
    await GoogleSignin.revokeAccess();
    await GoogleSignin.signOut();
    dispatch(logoutUser());
  } catch (error) {
    console.error(error);
  }
};
