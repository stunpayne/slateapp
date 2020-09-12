import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    // marginTop: StatusBar.currentHeight || 0,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  itemMain: {
    padding: 15,
    marginVertical: 8,
    marginRight: 20,
    marginLeft: 10,
    width: '85%',
    backgroundColor: "#ffffff",
    elevation:4,
    borderRadius: 27
  },
  itemMainView: {
    flexDirection: 'row',
    justifyContent: 'flex-start'
  },
  itemDescription: {
    flex: 1,
    paddingLeft: 30,
    paddingRight: 10
  },
  title: {
    fontSize: 16,
    fontFamily: "Ubuntu-Regular",
    color: "#000000"
  },
  description:{
    fontSize: 12,
    color: "#4158fb",
    fontFamily: "Ubuntu-Light",
  },
  timeContainer: {
    backgroundColor: "#4158fb",
    height: 23,
    borderRadius: 12,
    marginTop: 5
  },
  time: {
    fontSize: 16,
    color: "#ffffff",
    textAlign: "center",
    fontFamily: "Ubuntu-Regular",
  },
  circle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#f73381"
  },
  circleView: {
    alignSelf: 'center'
  },
  logo: {
    width: 60,
    height: 60,
  },
  button: {
    alignItems: "center",
    backgroundColor: "#ef6b91",
    padding: 10,
    margin: 20
  },
  hbar:{
    width:70,
    height:6,
    borderRadius:3,
    backgroundColor:"#e8e8e8",
    alignSelf:"center"
  },
  addTaskMessage:{
    textAlign:"center", 
    marginTop:10,
    fontSize:12,
    fontFamily: "Ubuntu-Regular",
  },
  addTaskImage:{
    width:50,
    height:50
  }
})