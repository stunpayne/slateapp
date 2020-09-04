import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  modalStyle:{
    padding: 25,
  },
  mainContainer:{
    // flex:1,
    flexDirection: 'column',
    minWidth:"80%",
    minHeight:"60%"
  },
  topContainer:{
    flexDirection: 'row',
    alignContent:"center",
    justifyContent:"space-between",
    minWidth:200
  },
  detailsContainer:{

  },
  bottomContainer:{

  },
  title:{
    fontSize:30
  },
  description:{

  },
  closeButton: {
    backgroundColor: "#ffffff",
    elevation: 0,
    height: 36,
    width: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  completeButton: {
    alignItems: "center",
    padding: 10,
    backgroundColor: "#ef6b91",
    marginTop: 20
  },
})