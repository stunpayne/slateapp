import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ActivityIndicator, ScrollView } from 'react-native';
import moment from 'moment';
import { connect } from 'react-redux';
import { _signOut } from "../../../../redux/actions/authActions";
import { fetchSlateTasks, slateTaskMarkComplete } from '../../../../redux/actions/taskActions';
import { storeData, retrieveData } from '../../../../config/storage';
import { FIRST_TIME_USE, TaskStatus } from '../../../../constants';

class MyDayScreen extends Component {
  componentDidMount() {
    setTimeout(() => {
      retrieveData(FIRST_TIME_USE).then((value) => {
        if (!value) {
          this.props.navigation.navigate('UserConfig');
        } else if (value) {
          this.getSlateTasks();
        }
      });
    }, 1000);
  };

  getSlateTasks = () => {
    let data = { user_id: this.props.slateInfo.id };
    this.props.fetchSlateTasks(data);
  };

  onPressMarkComplete = (taskId) => {
    this.setState({selected:taskId});
    let data = { user_id: this.props.slateInfo.id, id: taskId };
    this.props.slateTaskMarkComplete(data);
  }

  revokeAccess = () => {
    let data = { id: this.props.slateInfo.id };
    this.props._signOut(data);
  };

  onPressAddTask = () => {
    this.props.navigation.navigate('AddTask', { getSlateTasks: this.getSlateTasks });
  };

  onPressUserConfig = () => {
    this.props.navigation.navigate('UserConfig');
  }

  renderTasksList = (tasks) => {
    return tasks.map((item) => {
      return (
        <View style={styles.eventItem}>
          <Text>
            {item.title}
          </Text>
          <Text>
            Status : {item.status}
          </Text>
          <Text>
            Duration: {item.duration}
          </Text>
          <Text>
            Deadline: {moment(item.deadline).format('lll')}
          </Text>

          {
            item.start ?
              <React.Fragment>
                <Text>
                  Start: {moment(item.start).format('lll')}
                </Text>
              </React.Fragment> : null
          }

          {
            item.end ?
              <React.Fragment>
                <Text>
                  End: {moment(item.end).format('lll')}
                </Text>
              </React.Fragment> : null
          }

          {
            item.status == TaskStatus.SCHEDULED ?
              <React.Fragment>
                <TouchableOpacity style={styles.completeButton} onPress={() => this.onPressMarkComplete(item.id)}>
                  <Text>Complete</Text>
                  {this.state.selected == item.id && this.props.isUpdating ? <ActivityIndicator size="large" color="white" /> : null}
                </TouchableOpacity>
              </React.Fragment>
              : null
          }
        </View>
      );
    });
  };


  render() {
    const userInfo = this.props.userInfo;
    const { isLoading, tasks } = this.props;
    console.log("tasks", tasks);
    return (
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={{ fontSize: 23 }}>Welcome:{userInfo && userInfo.user ? userInfo.user.name : ""}</Text>
        </View>

        <View style={styles.eventsList}>
          {tasks.length > 0 ? this.renderTasksList(tasks) : <Text>No Slate Tasks</Text>}
        </View>

        <View>
          <TouchableOpacity
            style={styles.button}
            onPress={() => this.getSlateTasks()}
          >
            <View>
              <Text>Fetch Slate Tasks</Text>
              {isLoading ? <ActivityIndicator size="large" color="white" /> : null}
            </View>
          </TouchableOpacity>


          <TouchableOpacity
            style={styles.button}
            onPress={this.onPressUserConfig}
          >
            <Text>UserConfig</Text>
          </TouchableOpacity>

          {
            this.props.slateInfo.preferences && this.props.slateInfo.preferences.working_hours ?
              <TouchableOpacity
                style={styles.button}
                onPress={this.onPressAddTask}
              >
                <Text>AddTask</Text>
              </TouchableOpacity> : null
          }


          <TouchableOpacity
            style={styles.button}
            onPress={this.revokeAccess}
          >
            <Text>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView >
    );
  }
}

const mapStateToProps = state => ({
  userInfo: state.auth.userInfo,
  slateInfo: state.auth.slateInfo,
  isAuthenticated: state.auth.isAuthenticated,
  tasks: state.task.tasks,
  isLoading: state.task.isLoading,
  isUpdating: state.task.isUpdating,
});

export default connect(mapStateToProps, { _signOut, fetchSlateTasks, slateTaskMarkComplete })(MyDayScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    marginTop: 100,
    alignSelf: "center"
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  eventsList: {
    alignItems: 'center',
    margin: 10
  },
  eventItem: {
    padding: 10,
    backgroundColor: "#20d3d6",
    margin: 5
  },
  button: {
    alignItems: "center",
    backgroundColor: "#ef6b91",
    padding: 10,
    margin: 20
  },
  completeButton: {
    alignItems: "center",
    padding: 10,
    backgroundColor: "#ef6b91",
    marginTop: 20
  },
  image: {
    marginTop: 15,
    width: 150,
    height: 150,
    borderColor: "rgba(0,0,0,0.2)",
    borderWidth: 3,
    borderRadius: 150
  },
});