import React, { Component } from 'react';
import { View, Text, StyleSheet, ImageBackground } from 'react-native';
import { styles } from '../introStyles';
import { Images } from '../../../theme';
import LinearGradient from 'react-native-linear-gradient';

class SlideOne extends Component {
  render() {
    return (
      <View style={styles.slide}>
        <ImageBackground source={Images.bkgd_slide1} style={styles.image}>
          <LinearGradient colors={['rgba(247,51,129,0.36)', 'rgba(65,88,251,0.36)']}>
            <View style={styles.container}>
              <Text style={styles.title}>SlideOne Component</Text>
              <Text style={styles.description}>Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt.</Text>
            </View>
          </LinearGradient>
        </ImageBackground>
      </View>
    );
  }
}

export default SlideOne;