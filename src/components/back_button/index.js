import React from 'react';
import { TouchableOpacity, Image } from 'react-native';
import {Icon} from 'native-base';
import PropTypes from 'prop-types';
import styles from './backButtonStyle';

export default class BackButton extends React.Component {
  render() {
    return (
      <TouchableOpacity style={styles.headerButtonContainer} onPress={this.props.onPress}>
        <Icon name="arrow-left" type="FontAwesome5" style={styles.headerButtonImage} />
      </TouchableOpacity>
    );
  }
}

BackButton.propTypes = {
  onPress: PropTypes.func
};
