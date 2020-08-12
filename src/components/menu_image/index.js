import React from 'react';
import { TouchableOpacity, Image } from 'react-native';
import PropTypes from 'prop-types';
import styles from './styles';
import { Images } from '../../theme';

export default class MenuImage extends React.Component {
  render() {
    return (
      <TouchableOpacity style={styles.headerButtonContainer} onPress={this.props.onPress}>
        <Image
          style={styles.headerButtonImage}
          source={Images.menu_icon}
        />
      </TouchableOpacity>
    );
  }
}

MenuImage.propTypes = {
  onPress: PropTypes.func
};
