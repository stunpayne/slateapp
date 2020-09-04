import AsyncStorage from '@react-native-community/async-storage';

export const storeData = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (error) {
    console.log("Error while storing...", error);
  }
};


export const retrieveData = async (key) => {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value !== null) {
      return value;
    }
  } catch (error) {
    console.log("Error while fetching data");
  }
};

export const mergeData = async (key, value) => {
  try {
    await AsyncStorage.mergeItem(key, value);
  } catch (error) {
    console.log("Error while storing...");
  }
};

export const deleteData = async (key) => {
  try {
    await AsyncStorage.removeItem(key)
  }
  catch (error) {
    console.log("Error while deleting data");
  }
};

export const deleteMultipleData = async (keys) => {
  try {
    await AsyncStorage.multiRemove(keys)
  }
  catch (error) {
    console.log("Error while deleting multiple data");
  }
};