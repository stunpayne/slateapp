import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity,ActivityIndicator, ScrollView } from 'react-native';
import CustomModal from "../../../../../components/custom_modal";
import { Icon } from 'native-base';
import { styles } from './taskDetailsStyles';
import moment from 'moment';
import { connect } from 'react-redux';
import { TaskStatus } from '../../../../../constants';
import { slateTaskMarkComplete } from '../../../../../redux/actions/taskActions';


class TaskDetailsModal extends Component {
  
  onPressMarkComplete = (taskId) => {
    let data = { user_id: this.props.slateInfo.id, id: taskId };
    this.props.slateTaskMarkComplete(data, ()=> this.props.closeModal());
  }

  render() {
    const { isModalVisible, closeModal, task } = this.props;
    return (
      <CustomModal isModalVisible={isModalVisible} closeModal={closeModal} modalStyle={styles.modalStyle}>
        <View style={styles.mainContainer}>
          <View style={styles.topContainer}>
            <View style={{ height: 20, width: 20, backgroundColor: 'transparent' }} />

            <View style={{ alignSelf: "center" }}>
              <Text>TASK DETAILS</Text>
            </View>

            <View>
              <TouchableOpacity
                style={styles.closeButton}
                onPressIn={() => closeModal()}
              >
                <Icon name="md-close" type="Ionicons" style={{ color: "#2699fb", fontSize: 15 }} />
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView style={styles.detailsContainer}>
            <Text style={styles.title}>{task.title}</Text>
            {task.description ?
              <Text style={styles.description}>
                {task.description}
              </Text>
              : null}

            <Text>
              Type : {task.kind}
            </Text>
            <Text>
              Status : {task.status}
            </Text>
            <Text>
              Duration: {task.duration}
            </Text>
            <Text>
              {/* Deadline: {moment(task.deadline).format('lll')} */}
            </Text>

            {
              task.start ?
                <React.Fragment>
                  <Text>
                    Start: {moment(task.start).format('lll')}
                  </Text>
                </React.Fragment> : null
            }

            {
              task.end ?
                <React.Fragment>
                  <Text>
                    End: {moment(task.end).format('lll')}
                  </Text>
                </React.Fragment> : null
            }
          </ScrollView>
          <View style={styles.bottomContainer}>

            {
              task.status == TaskStatus.SCHEDULED ?
                <React.Fragment>
                  <TouchableOpacity style={styles.completeButton} onPress={() => this.onPressMarkComplete(task.id)}>
                    <Text>Complete</Text>
                    {this.props.isUpdating ? <ActivityIndicator size="large" color="white" /> : null}
                  </TouchableOpacity>
                </React.Fragment>
                : null
            }
          </View>
        </View>
      </CustomModal>
    );
  }
}

const mapStateToProps = state => ({
  userInfo: state.auth.userInfo,
  slateInfo: state.auth.slateInfo,  
  isUpdating: state.task.isUpdating,
});

export default connect(mapStateToProps, { slateTaskMarkComplete })(TaskDetailsModal);