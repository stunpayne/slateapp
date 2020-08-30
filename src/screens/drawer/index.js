import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import { styles } from './drawerStyles';
import { _signOut } from "../../redux/actions/authActions";
import { connect } from 'react-redux';


class DrawerContainer extends React.Component {
  revokeAccess = () => {
    let data = { id: this.props.slateInfo.id };
    this.props._signOut(data);
  };

  render() {
    const { navigation } = this.props;
    return (
      <View style={styles.content}>
        <View style={styles.container}>
          <MenuItem
            title="PREFERENCES"
            onPress={() => {
              navigation.navigate('UserConfig');
              navigation.closeDrawer();
            }}
          />

          <MenuItem
            title="LOGOUT"
            onPress={() => {
              this.revokeAccess();
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


const mapStateToProps = state => ({
  slateInfo: state.auth.slateInfo,
});

export default connect(mapStateToProps, { _signOut })(DrawerContainer);

const MenuItem = ({ title, onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    style={styles.menuItem}
  >
    <Text style={styles.title}>{title}</Text>
  </TouchableOpacity>
);
