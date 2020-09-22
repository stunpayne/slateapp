import React, { Component } from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { styles } from './analyticsStyles';


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
            <View style={{...styles.itemMainBottomBox,  backgroundColor: '#4158fb' }}>
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
  }

  renderAnalyticsScreen = () => {
    let dailyData = {
      title: "DAILY SUMMARY",
      completed: 5,
      inprogress: 2,
      overdue: 10
    };

    let weeklyData = {
      title: "WEEKLY SUMMARY",
      completed: 42,
      inprogress: 8,
      overdue: 10
    };

    return (
      <View style={{ flex: 1, flexDirection: 'column', marginTop:10 }}>
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

export default AnalyticsScreen;