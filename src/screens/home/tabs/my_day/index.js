import React, { Component } from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView, StatusBar, TouchableOpacity, Dimensions, Image, ActivityIndicator } from "react-native";
import moment from 'moment';
import { connect } from 'react-redux';
import { Images } from '../../../../theme';
import { fetchSlateTasks, slateTaskMarkComplete } from '../../../../redux/actions/taskActions';
import AddTaskModal from './add_task';
import TaskDetailsModal from './task_details';
import { FIRST_TIME_USE, TaskStatus } from '../../../../constants';
const windowHeight = Dimensions.get('window').height;
import { styles } from './mydayStyles';

const Item = ({ item, onPress }) => (
  <View style={styles.item}>
    <View style={styles.circleView}>
      <View style={styles.circle}></View>
    </View>
    <TouchableOpacity onPress={onPress} style={styles.itemMain}>
      <View style={styles.itemMainView}>
        <Image
          style={styles.logo}
          source={Images.slate_icon_dark}
        />
        <View style={styles.itemDescription}>
          <Text style={styles.title}>{item.title}</Text>
          <View>
            {item.description ? <Text style={styles.description}>{item.description}</Text> : null}
          </View>
          <View style={styles.timeContainer}>
            <Text style={styles.time}>{moment(item.start).format('HH:mm')}-{moment(item.end).format('HH:mm')}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  </View>
);


class MyDayScreen extends Component {
  state = {
    selectedTask: null,
    showTaskDetails: false,
    showAddTask: false
  };

  componentDidMount() {
    setTimeout(() => {
      if (this.props.slateInfo.default_timezone && this.props.slateInfo.default_timezone.length > 0) {
        this.getSlateTasks();
      } else {
        this.props.navigation.navigate('UserConfig');
      };
    }, 5000);
  };

  getSlateTasks = () => {
    let data = { user_id: this.props.slateInfo.id };
    this.props.fetchSlateTasks(data);
  };

  onPressAddTask = () => {
    this.setState({ showAddTask: true });
  };

  closeAddTask = () => {
    this.setState({ showAddTask: false });
  }

  openTaskDetails = (task) => {
    this.setState({ showTaskDetails: true, selectedTask: task });
  };

  closeTaskDetails = () => {
    this.setState({ showTaskDetails: false, selectedTask: null });
  };

  renderItem = ({ item }) => {
    const { selectedTask } = this.state;
    return (
      <Item
        item={item}
        onPress={() => this.openTaskDetails(item)}
      />
    );
  };

  renderBottomTaskContaniner = () => {
    return (
      <View>
        <Text>NO PENDING TASKS FOR THE DAY</Text>
      </View>
    )
  }

  renderScreen = (DATA, selectedId) => {
    if (DATA && DATA.length > 0) {
      return (
        <React.Fragment>
          <View style={{ flexDirection: 'row' }}>
            <View
              style={{
                height: windowHeight,
                width: 6,
                backgroundColor: "#4158fb",
                marginRight: -13,
                marginLeft: 15
              }}
            />
            <FlatList
              data={DATA}
              renderItem={this.renderItem}
              keyExtractor={(item) => item.id}
              extraData={selectedId}
            />
          </View>
          {this.renderBottomTaskContaniner()}
        </React.Fragment>
      )
    } else {
      return (
        this.renderBottomTaskContaniner()
      )
    }
  }

  render() {
    const { selectedId } = this.state;
    const { isLoading, tasks } = this.props;
    return (
      <SafeAreaView style={styles.container}>

        {
          this.props.slateInfo.preferences && this.props.slateInfo.preferences.working_hours ?
            <TouchableOpacity
              style={styles.button}
              onPress={this.onPressAddTask}
            >
              <Text>AddTask</Text>
            </TouchableOpacity> : null
        }

        {this.renderScreen(tasks, selectedId)}

        <React.Fragment>
          {this.state.showAddTask && (
            <AddTaskModal
              isModalVisible={this.state.showAddTask}
              closeModal={this.closeAddTask}
              getSlateTasks={this.getSlateTasks}
            />
          )}
        </React.Fragment>

        <React.Fragment>
          {this.state.showTaskDetails && (
            <TaskDetailsModal
              isModalVisible={this.state.showTaskDetails}
              closeModal={this.closeTaskDetails}
              task={this.state.selectedTask}
            />
          )}
        </React.Fragment>
      </SafeAreaView>
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

export default connect(mapStateToProps, { fetchSlateTasks, slateTaskMarkComplete })(MyDayScreen);