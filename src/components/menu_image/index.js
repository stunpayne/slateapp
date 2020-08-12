import React from 'react';
import { TouchableOpacity, Image } from 'react-native';
import {Icon} from 'native-base';
import PropTypes from 'prop-types';
import styles from './styles';
import { Images } from '../../theme';

export default class MenuImage extends React.Component {
  render() {
    return (
      <TouchableOpacity style={styles.headerButtonContainer} onPress={this.props.onPress}>
        <Icon name="ellipsis-v" type="FontAwesome5" style={styles.headerButtonImage} />
      </TouchableOpacity>
    );
  }
}

MenuImage.propTypes = {
  onPress: PropTypes.func
};
