import axios from 'axios';
import { GoogleSignin } from '@react-native-community/google-signin';

export const googleApiClient = async () => {
  let AuthInstance = await getAuthInstance();

  return {
    get: (url, options = {}) => AuthInstance.get(url, { ...options }),
    post: (url, data, options = {}) => AuthInstance.post(url, data, { ...options }),
    put: (url, data, options = {}) => AuthInstance.put(url, data, { ...options }),
    delete: (url, options = {}) => AuthInstance.delete(url, { ...options }),
  };
};

const getAuthInstance = async () => {
  let defaultOptions = {};
  try {
    const tokens = await GoogleSignin.getTokens();
    if (tokens.accessToken && tokens.accessToken.length > 0) {
      console.log("token", tokens.accessToken);
      defaultOptions = {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`
        },
      };
    }
  } catch (error) {
    console.log('error', error);
  };

  return axios.create(defaultOptions);
}