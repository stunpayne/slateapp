import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  modalTitle: { 
    backgroundColor: "#f73381", 
    borderRadius: 18, 
    paddingHorizontal: 10, 
    paddingVertical: 5 
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    alignSelf: "center",
    marginTop: 20,
    borderRadius: 12,
  },
  label:{
    fontSize: 14,
    fontFamily: "Ubuntu-Regular",
    color: 'rgba(0,0,0,0.61)'
  },
  input: {
    fontFamily: "Ubuntu-Regular",
    fontSize: 18,
  },
  buttonText: {
    fontFamily: "Ubuntu-Regular",
    fontSize: 18,
    fontWeight: "500",
    color: "#4158fb",
  },
  item: {
    marginTop: 10
  },
  errorTextStyle: {
    color: "#ff0000",
    marginLeft: 10,
  },
  closeButton: {
    backgroundColor: "#ffffff",
    elevation: 0,
    height: 36,
    width: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center'
  }
})