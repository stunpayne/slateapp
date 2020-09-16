import React, { Component } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
// import { Calendar } from 'react-native-big-calendar';
import { Calendar } from '../../../../components/calendar';
import CalendarStrip from 'react-native-calendar-strip';
import moment from 'moment';

const height = Dimensions.get('window').height;

const events = [
  {
    title: 'dummy Meeting',
    start: moment(),
    end: moment().add(1, 'hour'),
  }
]


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
      <View style={{flex:1}}>
        <CalendarStrip
          scrollable={false}
          selectedDate={this.state.selectedDate}
          calendarAnimation={{ type: 'sequence', duration: 30 }}
          daySelectionAnimation={{ type: 'background', duration: 200, highlightColor: '#4158fb' }}
          highlightDateNumberStyle={{ color: 'white' }}
          highlightDateNameStyle={{ color: 'white' }}
          style={{ height: 120, paddingTop: 20, paddingBottom: 10 }}
          calendarColor={'white'}
          dateNameStyle={{ color: '#BBBBBB' }}
          dateNumberStyle={{ color: '#000000', paddingTop: 10 }}
          iconContainer={{ flex: 0.1 }}
          datesBlacklist={this.datesBlacklistFunc}
          onDateSelected={this.onDateSelected}
        />
        <View
          style={{
            borderBottomColor: '#e3e3e3',
            borderBottomWidth: 1,
          }}
        />
        <View style={{maxHeight: "75%"}}>
          <Calendar
            mode={'day'}
            events={events}
            height={height}
            onPressDateHeader={date => console.log("date", date)}
          />
        </View>
      </View>
    );
  }
};

export default CalendarScreen;

const styles = StyleSheet.create({});