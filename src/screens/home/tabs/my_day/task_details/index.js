import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import CustomModal from "../../../../../components/custom_modal";
import { Icon } from 'native-base';
import { styles } from './taskDetailsStyles';

class TaskDetailsModal extends Component {
  render() {
    const { isModalVisible, closeModal, task } = this.props;
    return (
      <CustomModal isModalVisible={isModalVisible} closeModal={closeModal}>
        <View
          style={{
            ...StyleSheet.absoluteFillObject,
            flexDirection: 'column',
            alignItems: "flex-end",
            marginTop: 0,
            marginRight: 0,
          }}>
          <TouchableOpacity
            style={styles.closeButton}
            onPressIn={() => closeModal()}
          >
            <Icon name="md-close" type="Ionicons" style={{ color: "#2699fb", fontSize: 15 }} />
          </TouchableOpacity>
        </View>

        <View>
          <Text>{task.title} Component</Text>
        </View>
      </CustomModal>
    );
  }
}

export default TaskDetailsModal;