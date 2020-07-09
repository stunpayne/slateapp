import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Container, Header, Content, Form, Item, Input, Button, Text, Label } from 'native-base';
import { connect } from 'react-redux';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import { addCalendarEvent } from '../../redux/actions/taskActions';

class AddTaskScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'Add Task',
  });
  state = {
    eventName: "",
    startDate: null,
    startTime: null,
    endDate: null,
    endTime: null,
    show: null
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

  onChange = (e, type) => {
    console.log("e", e);
    if (e.nativeEvent && e.nativeEvent.timestamp) {
      this.setState({ [type]: new Date(e.nativeEvent.timestamp), show: null });
    }
  };

  isValid(date) {
    if (date != null) {
      return !isNaN(date.getTime())
    }
    return false;
  };

  extractDateTime(date, time) {
    let datestr = moment(date.toISOString()).format('L');
    let timestr = moment(time.toISOString()).format('LT');
    let final = moment(datestr + ' ' + timestr, 'MM/DD/YYYY h:mm A').format();
    return final;
  };

  checkTimeStamps(start, end) {
    let isValid = true;

    if (!moment(end).isAfter(start)) {
      isValid = false;
    };

    return isValid
  }

  onSubmit = () => {
    const { startDate, startTime, endDate, endTime, eventName } = this.state;
    if (eventName && eventName.length > 0 && this.isValid(startDate) && this.isValid(startTime) && this.isValid(endDate) && this.isValid(endTime)) {
      let startDateTime = this.extractDateTime(startDate, startTime);
      let endDateTime = this.extractDateTime(endDate, endTime);
      if (this.checkTimeStamps(startDateTime, endDateTime)) {
        let data = {
          start: {
            dateTime: startDateTime
          }, end: {
            dateTime: endDateTime
          },
          summary: eventName
        };
        // console.log("data", data);
        this.props.addCalendarEvent(data);
      } else {
        console.log("start and end is not in order, do it again")
      }
    } else {
      console.log("do it again");
    }
  };
  render() {
    const { startDate, startTime, endDate, endTime, show, eventName } = this.state;
    const RED_ASTERISK = <Text style={{ color: "#ff0000" }}>*</Text>;
    const { isLoading } = this.props;
    return (
      <View style={styles.container}>
        <Container>
          <Content>
            <Form style={{ marginTop: 40 }}>
              <Item floatingLabel>
                <Label>
                  Enter Event Name {RED_ASTERISK}
                </Label>
                <Input
                  value={eventName}
                  onChangeText={
                    value => this.setState({ eventName: value })
                  }
                />
              </Item>
              {/* Start Date */}
              <Item style={{ marginTop: 15 }}>
                <Button style={{ minWidth: 120 }} primary onPress={() => this.setState({ show: 'startDate' })}><Text> Start Date {RED_ASTERISK} </Text></Button>
                <Label style={{ marginLeft: 20 }}>{startDate != null ? moment(startDate).format('l') : <Text>Select Start Date</Text>}</Label>
                {show == 'startDate' && <DateTimePicker
                  value={startDate != null ? startDate : new Date()}
                  mode="date"
                  minimumDate={new Date()}
                  onChange={e => this.onChange(e, 'startDate')}
                />}
              </Item>

              {/* Start time */}
              <Item style={{ marginTop: 15 }}>
                <Button style={{ minWidth: 120 }} primary onPress={() => this.setState({ show: 'startTime' })}><Text> Start Time {RED_ASTERISK}</Text></Button>
                <Label style={{ marginLeft: 20 }}>{startTime != null ? moment(startTime).format('LT') : <Text>Select Start Time</Text>}</Label>
                {show == 'startTime' && <DateTimePicker
                  value={startTime != null ? startTime : new Date()}
                  mode="time"
                  onChange={e => this.onChange(e, 'startTime')}
                />}
              </Item>

              {/* End Date */}
              <Item style={{ marginTop: 15 }}>
                <Button style={{ minWidth: 120 }} primary onPress={() => this.setState({ show: 'endDate' })}><Text> End Date {RED_ASTERISK}</Text></Button>
                <Label style={{ marginLeft: 20 }}>{endDate != null ? moment(endDate).format('l') : <Text>Select End Date </Text>}</Label>
                {show == 'endDate' && <DateTimePicker
                  value={endDate != null ? endDate : new Date()}
                  mode="date"
                  onChange={e => this.onChange(e, 'endDate')}
                />}
              </Item>

              {/* End Time */}
              <Item style={{ marginTop: 15 }}>
                <Button style={{ minWidth: 120 }} primary onPress={() => this.setState({ show: 'endTime' })}><Text> End Time {RED_ASTERISK}</Text></Button>
                <Label style={{ marginLeft: 20 }}>{endTime != null ? moment(endTime).format('LT') : <Text>Select End Time </Text>}</Label>
                {show == 'endTime' && <DateTimePicker
                  value={endTime != null ? endTime : new Date()}
                  mode="time"
                  onChange={e => this.onChange(e, 'endTime')}
                />}
              </Item>

              <TouchableOpacity
                style={styles.button}
                onPress={this.onSubmit}
              >
                <View>
                  <Text>Submit</Text>
                  {isLoading ? <ActivityIndicator size="large" color="white" /> : null}
                </View>
              </TouchableOpacity>
            </Form>

          </Content>
        </Container>
      </View>
    );
  }
}

const mapStateToProps = state => ({
  userInfo: state.auth.userInfo,
  isAuthenticated: state.auth.isAuthenticated,
  isLoading: state.task.isLoading
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
});