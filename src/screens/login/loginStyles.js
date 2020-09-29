import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  title:{
    fontFamily:"Ubuntu-Regular",
    fontSize:20,
    marginBottom:100
  },
  description:{
    fontFamily:"Ubuntu-Regular",
    fontSize:16,
    margin:30
  },
  termsText:{
    fontFamily:"Ubuntu-Regular",
    fontSize:12,
    color:"#000000", 
    textAlign:"center",
    paddingHorizontal:70,
    marginTop:30
  },
  logo:{
    width: 100,
    height: 100,
  },
  logoContainer:{
    elevation:4,
    marginBottom:10,
    borderRadius: 49,
  }
});