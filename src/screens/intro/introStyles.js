import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ce7d65'
  },
  title: {
    color: '#ffffff',
    fontSize: 40,
    textAlign:"center",
    fontFamily:"Ubuntu-Regular"
  },
  description:{
    color: '#ffffff',
    fontSize: 20,
    textAlign:"center",
    marginTop:20,
    fontFamily:"Arial"
  },
  button: {
    alignItems: "center",
    backgroundColor: "#ef6b91",
    maxWidth:200,
    padding: 10,
    marginTop:20
  },
  buttonText:{
    color:"#ffffff",
    fontSize:12,
  },
  image: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center"
  }
});