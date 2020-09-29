import React, { Component } from 'react';
import { View, Text, StyleSheet, Dimensions, SafeAreaView } from 'react-native';
// import { Calendar } from 'react-native-big-calendar';
import { Calendar } from '../../../../components/calendar';
import CalendarStrip from 'react-native-calendar-strip';
import moment from 'moment';
import { connect } from 'react-redux';
import { getMergedEventsAndTasks } from '../../../../services/taskService';
import { calendarEventColor } from "../../../../constants";

const height = Dimensions.get('window').height;


class CalendarScreen extends Component {
  state = {
    selectedDate: moment(),    
    data:[],
    selectedEvents:[]
  };

  componentDidMount() {
    this.setCalendarData();
  };

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.tasks != this.props.tasks || prevProps.events != this.props.events) {
      this.setCalendarData();
    }
  };

  setCalendarData = () => {
    const { tasks, events } = this.props;
    let default_timezone = this.props.slateInfo.default_timezone;
    let data = getMergedEventsAndTasks(tasks, events, default_timezone);
    let selectedEvents = this.getEventsByDate(data, this.state.selectedDate);
    this.setState({ data, selectedEvents });
  };

  getEventsByDate(data, date){
    let events = [];
    data.map(e=>{      
      let {title, start, end, kind} = e;
      if (moment(start).format("YYYY-MM-DD") == date.format('YYYY-MM-DD')){
        let event = {};
        event['title'] = title;
        event['start'] = moment(start);
        event['end'] = moment(end);
        event['kind'] = kind;
        events.push(event);
      };
    });

    return events;
  };

  datesBlacklistFunc = date => {
    // return date.isoWeekday() === 6; // disable Saturdays
    return false;
  }

  onDateSelected = date => {
    // console.log(date.format('YYYY-MM-DD'));
    let selectedEvents = this.getEventsByDate(this.state.data, date);
    this.setState({ selectedEvents, selectedDate:date });
  };
  
  handleCellStyle = e =>{
    if(e.kind == calendarEventColor.slate){
      return {backgroundColor: "#4158fb"};
    } else {
      return {backgroundColor: "#713b9b"};
    }
  };

  render() {
    return (
      <SafeAreaView style={{flex:1}}>
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
        <View style={{flex:1}}>
          <Calendar
            date = {this.state.selectedDate}
            mode={'day'}
            events={this.state.selectedEvents}
            height={height}
            onPressDateHeader={date => console.log("date", date)}
            eventCellStyle = {this.handleCellStyle}
          />
        </View>
      </SafeAreaView>
    );
  }
};


const mapStateToProps = state => ({
  userInfo: state.auth.userInfo,
  slateInfo: state.auth.slateInfo,
  isAuthenticated: state.auth.isAuthenticated,
  tasks: state.task.tasks,
  events: state.task.events
});

export default connect(mapStateToProps, {  })(CalendarScreen);

const styles = StyleSheet.create({});