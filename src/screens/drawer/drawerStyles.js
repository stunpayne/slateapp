import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  content: {
    flex: 1,
    flexDirection: 'row',
    // alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:"#4158fb"
  },
  container: {
    flex: 1,
    alignItems: 'flex-start',
    paddingHorizontal: 20, 
    marginTop:60
  },
  menuItem:{
    padding: 40,
  },
  title:{
    fontFamily:"Ubuntu-Bold",
    fontSize:16,
    color:"#fff"
  }
});

