import { SET_CURRENT_USER, LOGOUT_USER, SET_SLATE_USER, SET_SLATE_UPDATED_USER, AUTH_DATA_LOADING_STATUS } from '../types';
import { GoogleSignin } from '@react-native-community/google-signin';
import axios from 'axios';
import { base_url } from '../../config/urls';
import { storeData, retrieveData } from '../../config/storage';
import NavigationService from '../../services/NavigationService';
import { SLATE_USER_CREATED, FIRST_TIME_USE } from '../../constants';

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

export function setSlateInfo(userInfo, slateInfo) {
  return {
    type: SET_SLATE_USER,
    userInfo: userInfo,
    slateInfo: slateInfo
  };
};

export function setUpdatedSlateInfo(slateInfo){
  return {
    type: SET_SLATE_UPDATED_USER,
    slateInfo: slateInfo
  };
}

export function setDataLoadingStatus(status) {
  return {
    type: AUTH_DATA_LOADING_STATUS,
    payload: status
  };
};

export const createFetchSlateUser = (userInfo) => dispatch => {
  // save user in slate db  
  let email = userInfo.user.email;
  axios.get(`${base_url}/api/user/get/email/${email}`)
    .then(res => {
      if (res.status == 200 || res.status == 201) {
        dispatch(setSlateInfo(userInfo, res.data.data[0]));
        NavigationService.navigate("Home");
      }
    }).catch(err => {
      if (err.response.data.error && err.response.data.error == "User not found") {
        let data = {
          email: userInfo.user.email,
          name: userInfo.user.name
        };
        axios.post(`${base_url}/api/user/create`, data)
          .then(res => {
            if (res.status == 200 || res.status == 201) {
              storeData(SLATE_USER_CREATED, "true").then(() => {
                dispatch(setSlateInfo(userInfo, res.data.data[0]));
                NavigationService.navigate("Home");
              });
            }
          }).catch(error => {
            console.log("error in createSlateUser", error.response.data);
            NavigationService.navigate("Login");
          });
      } else {
        console.log("err in fetchSlateUser", err.response.data);
      }
    });
};


export const updateSlateUser = (data) => dispatch => {
  dispatch(setDataLoadingStatus(true));
  axios.put(`${base_url}/api/user/update`, data)
    .then(res => {
      if (res.status == 200 || res.status == 201) {
        dispatch(setUpdatedSlateInfo(res.data.data));
        storeData(FIRST_TIME_USE, "false");
      }
    }).catch(error => {
      dispatch(setDataLoadingStatus(false));
      console.log("error in updateSlateUser", error.response.data);
    });
};


export const _signOut = (data) => async dispatch => {
  //Remove user session from the device.
  console.log("Signout presed");
  try {
    await GoogleSignin.revokeAccess();
    await GoogleSignin.signOut();

    try {
      let res = await axios.put(`${base_url}/api/user/logout`, data);
      if (res.status == 200 || res.status == 201) {
        NavigationService.navigate("Login");
        dispatch(logoutUser());
      };
    } catch (error) {
      console.error("Slate logout API error", error.response.data);
    }
  } catch (error) {
    console.error("Google signout error", error);
  }
};
