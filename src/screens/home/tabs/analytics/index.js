import React, { Component } from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { styles } from './analyticsStyles';
import { connect } from 'react-redux';
import { TaskStatus } from '../../../../constants';
import moment from 'moment';

class AnalyticsScreen extends Component {

  summaryContainer = (data) => {
    let title = data.title ? data.title : "";
    let completed = data.completed ? data.completed : 0;
    let inprogress = data.inprogress ? data.inprogress : 0;
    let overdue = data.overdue ? data.overdue : 0;

    return (
      <View style={styles.itemContainer}>
        <View style={styles.itemMainContainer}>
          <View style={styles.itemMainTopContainer}>
            <Text style={styles.itemTite}>{title}</Text>
          </View>
          <View style={styles.itemMainBottomContainer}>
            <View style={{ ...styles.itemMainBottomBox, backgroundColor: '#4158fb' }}>
              <Text style={styles.itemBoxCounter}>{completed}</Text>
              <Text style={styles.itemBoxTitle}>Completed</Text>
            </View>
            <View style={{ ...styles.itemMainBottomBox, backgroundColor: '#f73381' }}>
              <Text style={styles.itemBoxCounter}>{inprogress}</Text>
              <Text style={styles.itemBoxTitle}>In Progress</Text>
            </View>
            <View style={{ ...styles.itemMainBottomBox, backgroundColor: '#feb22a' }}>
              <Text style={styles.itemBoxCounter}>{overdue}</Text>
              <Text style={styles.itemBoxTitle}>Overdue</Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  getDailyData = (tasks) => {
    let completed = 0, inprogress = 0, overdue = 0, total=0;

    for (var i = 0; i < tasks.length; i++) {
      let task = tasks[i];
      if (!moment(task.start).isSame(moment(), 'day')){
        continue;
      };

      total+=1;

      if (task.status == TaskStatus.COMPLETED){
        // If task is completed 
        completed+=1;
      } else if(task.status == TaskStatus.SCHEDULED){
        // Task is scheduled but not completed
        if(moment(task.end).isBefore(moment())){
          overdue+=1;
        } else {
          inprogress+=1;
        }
      }
    };

    let res = {
      title: "DAILY SUMMARY",
      completed,
      inprogress,
      overdue,
      total
    };

    return res;
  };


  getWeeklyData = (tasks) => {
    let completed = 0, inprogress = 0, overdue = 0, total=0;

    for (var i = 0; i < tasks.length; i++) {
      let task = tasks[i];
      if (!moment(task.start).isBetween(moment().startOf('week'), moment().endOf('week'))){
        continue;
      };

      total+=1;

      if (task.status == TaskStatus.COMPLETED){
        // If task is completed 
        completed+=1;
      } else if(task.status == TaskStatus.SCHEDULED){
        // Task is scheduled but not completed
        if(moment(task.end).isBefore(moment())){
          overdue+=1;
        } else {
          inprogress+=1;
        }
      }
    };

    let res = {
      title: "WEEKLY SUMMARY",
      completed,
      inprogress,
      overdue,
      total
    };

    return res;
  };
  renderAnalyticsScreen = () => {
    let dailyData = this.getDailyData(this.props.tasks);
    let weeklyData = this.getWeeklyData(this.props.tasks);

    return (
      <View style={{ flex: 1, flexDirection: 'column', marginTop: 10 }}>
        {this.summaryContainer(dailyData)}
        {this.summaryContainer(weeklyData)}
      </View>
    )
  };

  render() {
    return (
      <SafeAreaView style={styles.container}>
        {this.renderAnalyticsScreen()}
      </SafeAreaView>
    );
  }
};

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
  tasks: state.task.tasks
});

export default connect(mapStateToProps, {})(AnalyticsScreen);