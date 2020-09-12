import React, { Component } from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView, StatusBar, TouchableOpacity, Dimensions, Image, ActivityIndicator } from "react-native";
import moment from 'moment';
import { connect } from 'react-redux';
import { Images } from '../../../../theme';
import { fetchSlateTasks, slateTaskMarkComplete } from '../../../../redux/actions/taskActions';
import AddTaskModal from './add_task';
import TaskDetailsModal from './task_details';
import { FIRST_TIME_USE, TaskStatus } from '../../../../constants';
import { styles } from './mydayStyles';
import NavigationService from '../../../../services/NavigationService';
import { ScrollView } from 'react-native-gesture-handler';
import { getTodayMergedEventsAndTasks } from '../../../../services/taskService';


const windowHeight = Dimensions.get('window').height;

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
            {item.description ? <Text style={styles.description}>{item.description.length > 20 ? item.description.substring(0, 20) + "..." : item.description}</Text> : null}
          </View>
          <View style={styles.timeContainer}>
            {/* 24-hrs - HH:mm, 12-hrs  hh:mm A*/}
            <Text style={styles.time}>{moment(item.start).format('HH:mm')}-{moment(item.end).format('HH:mm')}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  </View>
);


class MyDayScreen extends Component {
  state = {
    data: [],
    selectedTask: null,
    showTaskDetails: false,
    showAddTask: false
  };

  componentDidMount() {
    this.getSlateTasks();
    this.setMyDayData();
  };

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.tasks != this.props.tasks || prevProps.events != this.props.events) {
      this.setMyDayData();
    }
  };

  setMyDayData = () => {
    const { tasks, events } = this.props;
    let default_timezone = this.props.slateInfo.default_timezone;
    let data = getTodayMergedEventsAndTasks(tasks, events, default_timezone);
    this.setState({ data });
  };


  getSlateTasks = () => {
    let data = { user_id: this.props.slateInfo.id };
    this.props.fetchSlateTasks(data);
  };

  onPressAddTask = () => {
    this.setState({ showAddTask: true });
  };

  onPressUserConfig = () => {
    NavigationService.navigate("UserConfig");
  }

  closeAddTask = () => {
    this.setState({ showAddTask: false });
  }

  openTaskDetails = (task) => {
    this.setState({ showTaskDetails: true, selectedTask: task });
  };

  closeTaskDetails = () => {
    this.setState({ showTaskDetails: false, selectedTask: null });
  };

  renderItem = (item, i) => {
    return (
      <Item
        key={i}
        item={item}
        onPress={() => this.openTaskDetails(item)}
      />
    );
  };

  AddTaskContainer = () => {
    return (
      <View style={styles.item}>
        <View style={styles.circleView}>
        </View>
        <View style={styles.itemMain}>
          <View style={{ minHeight: 80 }}>
            <View style={styles.hbar}></View>
            <Text style={styles.addTaskMessage}>NO PENDING TASKS FOR THE DAY</Text>
            <TouchableOpacity onPress={this.onPressAddTask} style={{ alignSelf: "flex-end", borderRadius: 25, elevation: 3 }}>
              <Image style={styles.addTaskImage} source={Images.add_task_icon_light} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    )
  }

  AddPreferenceContainer = () => {
    return (
      <View style={styles.item}>
        <View style={styles.circleView}>
        </View>
        <View style={styles.itemMain}>
          <View style={{ minHeight: 80 }}>
            <View style={styles.hbar}></View>
            <Text style={styles.addTaskMessage}>Fill your preferences to be able to add your tasks</Text>

            <TouchableOpacity
              style={styles.button}
              onPress={this.onPressUserConfig}
            >
              <Text>Profile setup</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  renderMyDayScreen = () => {
    let DATA = this.state.data;
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
            <View style={{ flexDirection: 'column' }}>
              <ScrollView style={{ maxHeight: "67%", paddingTop:10 }} >
                {DATA.map((item, i) => {
                  return (this.renderItem(item, i))
                })}

                <View style={{padding:10}}></View>
              </ScrollView>
              <View
                style={{
                  flex: 1,
                  justifyContent: 'flex-end',
                  marginBottom: 110
                }}>
                {
                  this.props.slateInfo.preferences ?
                    this.AddTaskContainer() : null
                }
              </View>
            </View>
          </View>
        </React.Fragment>
      )
    } else {
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
            <View style={{ flexDirection: 'column' }}>
              <View
                style={{
                  flex: 1,
                  justifyContent: 'flex-end',
                  marginBottom: 110
                }}>
                {
                  this.props.slateInfo.preferences ?
                    this.AddTaskContainer() : this.AddPreferenceContainer()
                }
              </View>
            </View>
          </View>
        </React.Fragment>
      )
    }
  }

  render() {
    const { selectedId } = this.state;
    const { isLoading, tasks, events } = this.props;
    return (
      <SafeAreaView style={styles.container}>
        {this.renderMyDayScreen()}

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
  events: state.task.events,
  isLoading: state.task.isLoading,
  isUpdating: state.task.isUpdating,
});

export default connect(mapStateToProps, { fetchSlateTasks, slateTaskMarkComplete })(MyDayScreen);