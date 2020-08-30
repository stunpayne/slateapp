import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import CustomModal from "../../../../../components/custom_modal";
import { Container, Header, Content, Form, Item, Input, Button, Text, Label, Icon } from 'native-base';
import { connect } from 'react-redux';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import { addCalendarEvent, addSlateTask } from '../../../../../redux/actions/taskActions';
import { googleApiClient } from '../../../../../services/GoogleApiService';
import { isValidDate, checkEndValid, extractDateTime, fetchDndSlots } from './helper';
import { createSlots } from '../../../../../services/SlotterService';
import { CALENDAR_BASE_URL, SLOT_TYPE_FREE } from '../../../../../constants';
import { styles } from "./addtaskStyles";

class AddTaskModal extends Component {
  state = {
    fields: {},
    errors: {},
    show: null,
    dataLoading: false
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
      if (!isValidDate(fields['endDate'])) {
        formIsValid = false;
        errors['endDate'] = "Valid Deadline date is required";
      }
    }

    if (!fields['endTime']) {
      formIsValid = false;
      errors['endTime'] = "Deadline Time is required";
    };

    if (typeof fields['endTime'] !== 'undefined') {
      if (!isValidDate(fields['endTime'])) {
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
  };

  onSubmit = async () => {
    if (this.validateForm()) {
      const { duration, endDate, endTime, eventName } = this.state.fields;
      const eventDescription = this.state.fields.eventDescription ? this.state.fields.eventDescription : ""
      let deadline_ts = extractDateTime(endDate, endTime); //get deadline timestamp
      let isDeadlineValid = checkEndValid(moment().toISOString(), deadline_ts) //checking if deadline_ts > now
      if (isDeadlineValid) {
        this.setState({ dataLoading: true });
        const request = await googleApiClient();
        let now = moment().toISOString();
        var params = {
          timeMin: now,
          timeMax: deadline_ts,
          singleEvents: true //to expand recurring events to single events
        };

        // fetching calender events till deadline
        request.get(`${CALENDAR_BASE_URL}/calendars/primary/events`, { params }).then(res => {
          if (res.status == 200 && res.data.items) {
            let task = {
              duration,
              eventName,
              deadline_ts
            };

            let calenderEvents = res.data.items;
            let dndSlots = fetchDndSlots(now, deadline_ts, this.props.slateInfo);
            const refactoredEvents = calenderEvents.map(element => {
              return {
                start: element.start,
                end: element.end
              }
            });
            let mergedEvents = [...refactoredEvents, ...dndSlots];
            let slots = createSlots(deadline_ts, mergedEvents);
            let scheduleEvent = this.scheduleSlot(task, slots);

            if (scheduleEvent) {
              // free slot found
              console.log("scheduleEvent", scheduleEvent);
              this.props.addCalendarEvent(scheduleEvent).then(response => {
                if (response.status == 200) {
                  let slateTask = {
                    user_id: this.props.slateInfo.id,
                    title: eventName,
                    description: eventDescription,
                    deadline: deadline_ts,
                    duration: duration,
                    category: "default",
                    status: "SCHEDULED",
                    start: scheduleEvent.start.dateTime,
                    end: scheduleEvent.end.dateTime
                  };
                  this.props.addSlateTask(slateTask).then(res => {
                    if (res.status == 200 || res.status == 201) {
                      Alert.alert("Success!", "Event scheduled successfully",
                        [
                          { text: 'Okay', onPress: () => { this.props.closeModal() } }
                        ]
                      );
                      this.setState({ dataLoading: false });
                      this.getSlateTasks();
                    }
                  }).catch(err3 => {
                    console.log("err from adding slate task", err3);
                    this.setState({ dataLoading: false });
                  })
                };
              }).catch(err2 => {
                console.log("err from adding calender task", err2);
                this.setState({ dataLoading: false });
              });
            } else {
              // No free slot found
              this.setState({ dataLoading: false });
            }
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

  getSlateTasks() {
    this.props.getSlateTasks();
  };

  render() {
    const { isModalVisible, closeModal } = this.props;
    const { errors, fields, show, dataLoading } = this.state;
    const RED_ASTERISK = <Text style={{ color: "#ff0000" }}>*</Text>;

    return (
      <CustomModal isModalVisible={isModalVisible} closeModal={closeModal}>
        <View
          style={{
            ...StyleSheet.absoluteFillObject,
            flexDirection: 'column',
            alignItems: "flex-end",
            marginTop: 0,
            marginRight: 0,
          }}>
          <TouchableOpacity
            style={styles.closeButton}
            onPressIn={() => closeModal()}
          >
            <Icon name="md-close" type="Ionicons" style={{ color: "#2699fb", fontSize: 15 }} />
          </TouchableOpacity>
        </View>

        <View style={styles.modalTitle}>
          <Text style={{ color: "#ffffff" }}>Add To Slate</Text>
        </View>

        <View>
          <Form style={{ minWidth: 250 }}>
            {/* Event name */}
            <Item floatingLabel>
              <Label>
                Task Title... {RED_ASTERISK}
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

            {/* Event description */}
            <Item floatingLabel>
              <Label>
                Task Details...
              </Label>
              <Input
                value={fields.eventDescription}
                onChangeText={value => this.handleChange('eventDescription', value)}
              />
            </Item>
            {errors.eventDescription && errors.eventDescription.length ? (
              <Text style={styles.errorTextStyle}>
                {errors.eventDescription}
              </Text>
            ) : null}

            {/* Deadline Date */}
            <Item style={{ marginTop: 40 }}>
              <TouchableOpacity onPress={() => this.setState({ show: 'endDate' })}>
                <Label>{fields.endDate != null ? moment(fields.endDate).format('l') : <Text>Select Deadline Date {RED_ASTERISK}</Text>}</Label>
              </TouchableOpacity>
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
            <Item style={{ marginTop: 40 }}>
              <TouchableOpacity onPress={() => this.setState({ show: 'endTime' })}>
                <Label>{fields.endTime != null ? moment(fields.endTime).format('LT') : <Text>Select Deadline Time {RED_ASTERISK}</Text>}</Label>
              </TouchableOpacity>
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
      </CustomModal>
    );
  }
}

const mapStateToProps = state => ({
  userInfo: state.auth.userInfo,
  slateInfo: state.auth.slateInfo,
  isAuthenticated: state.auth.isAuthenticated,
  isLoading: state.task.isAdding
});

export default connect(mapStateToProps, { addCalendarEvent, addSlateTask })(AddTaskModal);