import { StyleSheet, Dimensions } from 'react-native';
const width = Dimensions.get('window').width;
const square_box = 0.23*width;

export const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  itemContainer: {
    alignItems: "center"
  },
  itemMainContainer: {
    padding: 20,
    marginVertical: 10,
    width: '90%',
    backgroundColor: "#ffffff",
    elevation: 4,
    borderRadius: 30
  },
  itemMainTopContainer: {
  },
  itemMainBottomContainer: {
    flexDirection: 'row', 
    justifyContent: "space-between",
    marginVertical:20
  },
  itemTite: {
    fontFamily: "Ubuntu-Bold",
    fontSize: 18,
    color: "#4158fb"
  },
  itemMainBottomBox:{
    width: square_box, 
    height: square_box,
    justifyContent:"center",
    alignItems:"center",
    borderRadius:10
  },
  itemBoxCounter:{
    color:"#ffffff",
    fontFamily: "Ubuntu-Regular",
    fontSize:20,
    fontWeight:"bold"
  },
  itemBoxTitle:{
    color:"#ffffff" ,
    fontFamily: "Ubuntu-Regular",
    fontSize:14
  }
})