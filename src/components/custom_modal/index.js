import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Image,
  SafeAreaView,
  Text,
  Modal,
  TouchableOpacity
} from 'react-native';



export default class CustomModal extends React.Component {
  render() {
    const { isModalVisible, closeModal, children, modalStyle } = this.props;
    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => closeModal()}
      >
        <View style={styles.centeredView}>
          <View style={[styles.modalView, modalStyle]}>
            {children}
          </View>
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    margin: 30,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  }
});
