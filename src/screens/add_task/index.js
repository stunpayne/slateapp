import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Container, Header, Content, Form, Item, Input, Button, Text, Label } from 'native-base';
import { connect } from 'react-redux';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import { addCalendarEvent } from '../../redux/actions/taskActions';
import { googleApiClient } from '../../services/GoogleApiService';
import { CALENDAR_BASE_URL, SLOT_TYPE_FREE } from '../../constants';
import { createSlots, getDNDSlots } from '../../services/SlotterService';
import { USER_DND_ENABLED, USER_DND_START, USER_DND_STOP } from '../../constants';

class AddTaskScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'Add Task',
  });

  state = {
    fields: {},
    errors: {},
    show: null,
    dataLoading: false
  };

  componentDidMount() {
    this.props.isAuthenticated && this.props.userInfo != null ? null : this.navigateBack();
  };

  componentDidUpdate() {
    // Redirecting to login page
    this.props.isAuthenticated && this.props.userInfo != null ? null : this.navigateBack();
  };

  navigateBack = () => {
    const resetAction = StackActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({ routeName: 'Login' })],
    });
    this.props.navigation.dispatch(resetAction);
  };

  onPickerChange = (e, name) => {
    console.log("e", e);
    if (e.nativeEvent && e.nativeEvent.timestamp) {
      let fields = this.state.fields;
      fields[name] = new Date(e.nativeEvent.timestamp);
      this.setState({ fields, show: null });
    }
  };

  handleChange = (name, value) => {
    let fields = this.state.fields;
    fields[name] = value;
    this.setState({ fields });
  };


  validateForm = () => {
    let fields = this.state.fields;
    let errors = {};
    let formIsValid = true;

    if (!fields['eventName']) {
      formIsValid = false;
      errors['eventName'] = "EventName is required";
    }

    if (!fields['endDate']) {
      formIsValid = false;
      errors['endDate'] = "Deadline date is required";
    }

    if (typeof fields['endDate'] !== 'undefined') {
      if (!this.isValid(fields['endDate'])) {
        formIsValid = false;
        errors['endDate'] = "Valid Deadline date is required";
      }
    }

    if (!fields['endTime']) {
      formIsValid = false;
      errors['endTime'] = "Deadline Time is required";
    };

    if (typeof fields['endTime'] !== 'undefined') {
      if (!this.isValid(fields['endTime'])) {
        formIsValid = false;
        errors['endTime'] = "Valid Deadline time is required";
      }
    }

    if (!fields['duration']) {
      formIsValid = false;
      errors['duration'] = "Event duration is required";
    };

    if (typeof fields['duration'] !== 'undefined') {
      if (parseInt(fields['duration']) < 0 || fields['duration'].indexOf('.') != -1) {
        formIsValid = false;
        errors['duration'] = "Valid event duration is required";
      };
    }

    this.setState({
      errors: errors,
    });
    return formIsValid;
  };

  isValid(date) {
    if (date != null) {
      return !isNaN(date.getTime())
    }
    return false;
  };

  compareTimeStamps(start, end) {
    let isValid = true;
    if (!moment(end).isAfter(start)) {
      isValid = false;
    };
    return isValid
  };

  extractDateTime(date, time) {
    let datestr = moment(date.toISOString()).format('L');
    let timestr = moment(time.toISOString()).format('LT');
    console.log("date", datestr, "time", timestr);
    let final = moment(datestr + ' ' + timestr, 'MM/DD/YYYY h:mm A').toISOString();
    return final;
  };

  extractDNDSlots(start, end) {
    let dndSlots = [];
    if (USER_DND_ENABLED) {
      dndSlots = getDNDSlots(start, end, USER_DND_START, USER_DND_STOP);
    };
    return dndSlots;
  };

  scheduleSlot(task, slots) {
    const freeSlot = slots.find((slot) => {
      if (slot.slotType == SLOT_TYPE_FREE) {
        return slot
      }
    });

    if (typeof freeSlot !== 'undefined') {
      // console.log("free slot", freeSlot);
      let data = {
        start: {
          dateTime: freeSlot.start.dateTime
        }, end: {
          dateTime: moment(freeSlot.start.dateTime).add(task.duration, "minutes").format()
        },
        summary: task.eventName
      };
      return data;
    } else {
      // throw an error, free slot not found
      console.log("No free slot found!");
      Alert.alert("Error!", "No free slot found!");
    };
    return null;
  }

  onSubmit = async () => {
    if (this.validateForm()) {
      const { duration, endDate, endTime, eventName } = this.state.fields;
      let deadline_ts = this.extractDateTime(endDate, endTime); //get deadline timestamp
      let isValidDeadline_ts = this.compareTimeStamps(new Date().toISOString(), deadline_ts) //checking if deadline_ts > now
      if (isValidDeadline_ts) {
        this.setState({ dataLoading: true });
        const request = await googleApiClient();
        let now = new Date().toISOString();
        var params = {
          timeMin: now,
          timeMax: deadline_ts,
          singleEvents: true //to expand recurring events to single events
        };

        //fetching calender events till deadline
        request.get(`${CALENDAR_BASE_URL}/calendars/primary/events`, { params }).then(res => {
          if (res.status == 200 && res.data.items) {
            let task = {
              duration,
              eventName,
              deadline_ts
            };

            let calenderEvents = res.data.items;
            let dndSlots = this.extractDNDSlots(now, deadline_ts);          
            const compressedCalenderEvents = calenderEvents.map(element => {
              return {
                start: element.start,
                end: element.end
              }
            });
            let mergedEvents = [...compressedCalenderEvents, ...dndSlots];
            let slots = createSlots(deadline_ts, mergedEvents);
            let scheduleEvent = this.scheduleSlot(task, slots);

            if (scheduleEvent) {
              console.log("scheduleEvent", scheduleEvent);
              this.props.addCalendarEvent(scheduleEvent).then(response => {
                if (response.status == 200) {
                  Alert.alert("Success!", "Event scheduled successfully",
                  [
                    {
                      text: 'Cancel',
                      onPress: () => console.log('Cancel Pressed'),
                      style: 'cancel'
                    },
                    { text: 'Go to Dashboard', onPress: () => this.props.navigation.navigate('Home') }
                  ]
                  );
                  this.setState({ dataLoading: false });
                  this.getEvents();
                };
              }).catch(err2 => {
                console.log("err from adding calender task", err2);
                this.setState({ dataLoading: false });
              });
            };
          }
        }).catch(err => {
          console.log("err from fetch calendar tasks", err);
          this.setState({ dataLoading: false });
        });
      } else {
        console.log("EndDateTime timestamp is passed");
      }
    }
  };

  getEvents(){
    this.props.navigation.state.params.getEvents();
  };
  
  render() {
    const { errors, fields, show, dataLoading } = this.state;
    const RED_ASTERISK = <Text style={{ color: "#ff0000" }}>*</Text>;
    return (
      <View style={styles.container}>
        <Container>
          <Content>
            <View style={{ marginTop: 40 }}>
              <Form>

                {/* Event name */}
                <Item floatingLabel>
                  <Label>
                    Enter Event Name {RED_ASTERISK}
                  </Label>
                  <Input
                    value={fields.eventName}
                    onChangeText={value => this.handleChange('eventName', value)}
                  />
                </Item>
                {errors.eventName && errors.eventName.length ? (
                  <Text style={styles.errorTextStyle}>
                    {errors.eventName}
                  </Text>
                ) : null}

                {/* Deadline Date */}
                <Item style={{ marginTop: 15 }}>
                  <Button style={{ minWidth: 120 }} primary onPress={() => this.setState({ show: 'endDate' })}><Text> Deadline Date {RED_ASTERISK}</Text></Button>
                  <Label style={{ marginLeft: 20 }}>{fields.endDate != null ? moment(fields.endDate).format('l') : <Text>Select Deadline Date </Text>}</Label>
                  {show == 'endDate' && <DateTimePicker
                    value={fields.endDate != null ? fields.endDate : new Date()}
                    minimumDate={new Date()}
                    mode="date"
                    onChange={e => this.onPickerChange(e, 'endDate')}
                  />}
                </Item>
                {errors.endDate && errors.endDate.length ? (
                  <Text style={styles.errorTextStyle}>
                    {errors.endDate}
                  </Text>
                ) : null}

                {/* Deadline Time */}
                <Item style={{ marginTop: 15 }}>
                  <Button style={{ minWidth: 120 }} primary onPress={() => this.setState({ show: 'endTime' })}><Text> Deadline Time {RED_ASTERISK}</Text></Button>
                  <Label style={{ marginLeft: 20 }}>{fields.endTime != null ? moment(fields.endTime).format('LT') : <Text>Select Deadline Time </Text>}</Label>
                  {show == 'endTime' && <DateTimePicker
                    value={fields.endTime != null ? fields.endTime : new Date()}
                    mode="time"
                    onChange={e => this.onPickerChange(e, 'endTime')}
                  />}
                </Item>
                {errors.endTime && errors.endTime.length ? (
                  <Text style={styles.errorTextStyle}>
                    {errors.endTime}
                  </Text>
                ) : null}

                {/* Duration */}
                <Item floatingLabel>
                  <Label>
                    Duration (minutes) {RED_ASTERISK}
                  </Label>
                  <Input
                    value={fields.duration}
                    keyboardType="number-pad"
                    onChangeText={value => this.handleChange('duration', value)}
                    maxLength={10}
                  />
                </Item>
                {errors.duration && errors.duration.length ? (
                  <Text style={styles.errorTextStyle}>
                    {errors.duration}
                  </Text>
                ) : null}

                <TouchableOpacity
                  style={styles.button}
                  onPress={this.onSubmit}
                >
                  <View>
                    <Text>Submit</Text>
                    {dataLoading ? <ActivityIndicator size="large" color="white" /> : null}
                  </View>
                </TouchableOpacity>
              </Form>
            </View>
          </Content>
        </Container>
      </View>
    );
  }
}

const mapStateToProps = state => ({
  userInfo: state.auth.userInfo,
  isAuthenticated: state.auth.isAuthenticated,
  isLoading: state.task.isAdding
});

export default connect(mapStateToProps, { addCalendarEvent })(AddTaskScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  button: {
    alignItems: "center",
    backgroundColor: "#ef6b91",
    padding: 10,
    margin: 20
  },
  errorTextStyle: {
    color: "#ff0000",
    marginLeft: 10,
  },
});