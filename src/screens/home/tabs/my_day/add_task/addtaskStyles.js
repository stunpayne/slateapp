import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  modalTitle: { 
    backgroundColor: "#f73381", 
    borderRadius: 18, 
    paddingHorizontal: 10, 
    paddingVertical: 5 
  },
  button: {
    alignItems: "center",
    backgroundColor: "#ef6b91",
    padding: 10,
    margin: 20
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