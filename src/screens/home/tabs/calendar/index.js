import React, { Component } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { Calendar } from 'react-native-big-calendar';
import moment from 'moment';

const height = Dimensions.get('window').height;

const events = [
  {
    title: 'Meeting',
    start: moment(),
    end: moment().add(1,'hour'),
  }
]


class CalendarScreen extends Component {
  render() {
    return (
      <View>        
        <Calendar
          mode = {'day'}
          events={events} 
          height={600} 
          onPressDateHeader={date => console.log("date", date)}
        />
      </View>
    );
  }
};

export default CalendarScreen;

const styles = StyleSheet.create({})