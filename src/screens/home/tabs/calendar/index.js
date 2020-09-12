import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import CalendarStrip from 'react-native-calendar-strip';
import moment from 'moment';

class CalendarScreen extends Component {  
  state = {
    selectedDate: moment(),
    formattedDate: moment().format('YYYY-MM-DD')
  };

  datesBlacklistFunc = date => {
    // return date.isoWeekday() === 6; // disable Saturdays
    return false;
  }

  onDateSelected = date => {
    this.setState({ formattedDate: date.format('YYYY-MM-DD') });
  };


  render() {
    return (
      <View>
        <CalendarStrip
          scrollable={false}
          selectedDate={this.state.selectedDate}
          calendarAnimation={{ type: 'sequence', duration: 30 }}
          daySelectionAnimation={{ type: 'background', duration: 200, highlightColor: '#4158fb' }}
          highlightDateNumberStyle={{color: 'white'}}
          highlightDateNameStyle={{color: 'white'}}
          style={{ height: 120, paddingTop: 20, paddingBottom: 10 }}
          calendarColor={'white'}
          dateNameStyle={{ color: '#BBBBBB' }}
          dateNumberStyle={{ color: '#000000', paddingTop: 10 }}
          iconContainer={{ flex: 0.1 }}
          datesBlacklist={this.datesBlacklistFunc}
          onDateSelected={this.onDateSelected}
        />
        <Text style={{ fontSize: 24 }}>Selected Date: {this.state.formattedDate}</Text>
      </View>
    );
  }
}

export default CalendarScreen;

const styles = StyleSheet.create({})