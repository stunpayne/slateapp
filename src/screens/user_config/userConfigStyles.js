import { StyleSheet } from 'react-native';
export const styles = StyleSheet.create({
  errorTextStyle: {
    color: "#ff0000",
    marginLeft: 10,
  },
  label:
  {
    fontSize: 14,
    fontFamily: "Ubuntu-Regular",
    color: 'rgba(0,0,0,0.61)'
  },
  time: {
    marginLeft: 50,
    paddingLeft: 50
  },
  item: {
    marginTop: 10
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    alignSelf: "center",
    marginTop: 20,
    borderRadius: 12,
  },
  buttonText: {
    fontFamily: "Ubuntu-Regular",
    fontSize: 18,
    fontWeight: "500",
    color: "#4158fb",
  },
  input: {
    fontFamily: "Ubuntu-Regular",
    fontSize: 18,
  },
  tabStyle: {
    backgroundColor: "#ffffff",
  },
  activeTabStyle: {
    // backgroundColor: "#4158fb",
    backgroundColor: "#ffffff",
  },
  tabBarUnderlineStyle:{
    backgroundColor:"#dd3878"
  },
  activeTextStyle:{
    color:"#000000",
    fontFamily: "Ubuntu-Regular",
    fontWeight:"bold",
    fontSize:14
  },
  textStyle:{
    color:'rgba(0,0,0,0.45)',
    fontFamily: "Ubuntu-Regular",
    fontWeight:"bold",
    fontSize:14
  },
  topContainer:{
    padding:30
  },
  user_profile_image:{
    width:120,
    height:120,
    borderRadius:60,
    alignSelf:"center"
  }
});