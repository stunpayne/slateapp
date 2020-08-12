import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import { styles } from '../introStyles';
import { Images } from '../../../theme';
import LinearGradient from 'react-native-linear-gradient';

class SlideFour extends Component {
  render() {
    return (
      <View style={styles.slide}>
        <ImageBackground source={Images.bkgd_slide4} style={styles.image}>
          <LinearGradient colors={['rgba(247,51,129,0.27)', 'rgba(65,88,251,0.27)']}>
            <View style={styles.container}>
              <Text style={styles.title}>SlideFour Component</Text>
              <Text style={styles.description}>Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt.</Text>
              <TouchableOpacity
                style={styles.button}
                onPress={this.props.onSubmit}
              >
                <Text style={styles.buttonText}>GET STARTED</Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </ImageBackground>
      </View>
    );
  }
}

export default SlideFour;