import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import { styles } from './drawerStyles';


export default class DrawerContainer extends React.Component {
  render() {
    const { navigation } = this.props;
    return (
      <View style={styles.content}>
        <View style={styles.container}>
          <MenuItem
            title="PREFERENCES"
            onPress={() => {
              navigation.navigate('Home');
              navigation.closeDrawer();
            }}
          />

          <MenuItem
            title="LOGOUT"
            onPress={() => {
              navigation.navigate('Home');
              navigation.closeDrawer();
            }}
          />
        </View>
      </View>
    );
  }
}

DrawerContainer.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired
  })
};

const MenuItem = ({ title, onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    style={styles.menuItem}
  >
    <Text style={styles.title}>{title}</Text>
  </TouchableOpacity>
);
