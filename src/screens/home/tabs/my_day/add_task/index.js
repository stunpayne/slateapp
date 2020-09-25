import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity, ActivityIndicator, Alert, ScrollView } from 'react-native';
import CustomModal from "../../../../../components/custom_modal";
import {
  Container, Header, Content, Form, Item, Input, Button, Text, Label, Icon, Picker,
  ListItem, Body, CheckBox
} from 'native-base';
import { connect } from 'react-redux';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import momentz from 'moment-timezone';
import { addCalendarEvent, addSlateTask, setCalendarEvents } from '../../../../../redux/actions/taskActions';
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
    dataLoading: false,
    new_category: false
  };

  checkBoxPressed = () => {
    this.setState({ new_category: !this.state.new_category });
  }


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
      var a = moment(slot.start.dateTime);
      var b = moment(slot.end.dateTime);
      var m_dif = b.diff(a, 'minutes'); //end-start
      var isValid = a.isAfter(moment());
      if (slot.slotType == SLOT_TYPE_FREE && m_dif > task.duration && isValid) {
        return slot
      };
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
    // console.log("test", moment().format())
    if (this.validateForm()) {
      const { duration, endDate, endTime, eventName } = this.state.fields;
      const eventDescription = this.state.fields.eventDescription ? this.state.fields.eventDescription : "";
      const category = this.state.fields.category ? this.state.fields.category : "default";
      const d_timezone = this.props.slateInfo.default_timezone;

      let deadline_ts = extractDateTime(endDate, endTime); //get deadline timestamp
      let isDeadlineValid = checkEndValid(momentz().tz(d_timezone).format(), deadline_ts) //checking if deadline_ts > now

      if (isDeadlineValid) {
        this.setState({ dataLoading: true });
        const request = await googleApiClient();
        let now = momentz().tz(d_timezone).format();
        var params = {
          timeMin: now,
          timeMax: deadline_ts,
          singleEvents: true //to expand recurring events to single events
        };

        // console.log("now", now);
        // console.log("pparams", params);

        // fetching calender events till deadline
        request.get(`${CALENDAR_BASE_URL}/calendars/primary/events`, { params }).then(res => {
          if (res.status == 200 && res.data.items) {
            let task = {
              duration,
              eventName,
              deadline_ts
            };

            let calenderEvents = res.data.items;
            this.props.setCalendarEvents(calenderEvents);
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
            
            // console.log("mergedEvents", mergedEvents);
            // console.log("slots", slots);

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
                    category: category,
                    status: "SCHEDULED",
                    start: scheduleEvent.start.dateTime,
                    end: scheduleEvent.end.dateTime,
                    calendar_id:response.data.id
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

  mapCategories(slateInfo) {
    let categories = [];
    categories.push({ label: "------", value: '----------' });

    if (slateInfo && slateInfo.categories) {
      slateInfo.categories.map(category => {
        let item = {};
        item.label = category;
        item.value = category;

        categories.push(item);
      })
    }
    return categories;
  }


  render() {
    const { isModalVisible, closeModal } = this.props;
    const { errors, fields, show, dataLoading } = this.state;
    const RED_ASTERISK = <Text style={{ color: "#ff0000" }}>*</Text>;
    const categories = this.mapCategories(this.props.slateInfo);

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

        <Container style={{ minWidth: 250, maxHeight: 400 }}>
          <Content>
            <Form>
              {/* Event name */}
              <Item>
                <Input
                  placeholder={"Task Title..."}
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
              <Item>
                <Input
                  placeholder={"Task Details..."}
                  value={fields.eventDescription}
                  onChangeText={value => this.handleChange('eventDescription', value)}
                />
              </Item>
              {errors.eventDescription && errors.eventDescription.length ? (
                <Text style={styles.errorTextStyle}>
                  {errors.eventDescription}
                </Text>
              ) : null}


              <View style={{ flexDirection: "row", marginTop: 10, paddingLeft: 15 }}>
                <Label>
                  Add a new category
              </Label>
                <CheckBox checked={this.state.new_category} color={'#4158fb'} onPress={e => this.checkBoxPressed()} />
              </View>

              {
                !this.state.new_category ?
                  <Item style={{ marginTop: 10 }}>
                    <Label>
                      <Text >Category..</Text>
                    </Label>
                    <Picker
                      mode="dropdown"
                      iosIcon={<Icon name="arrow-down" />}
                      style={{ padding: 0, margin: 0 }}
                      selectedValue={this.state.fields.category}
                      onValueChange={value => { this.handleChange('category', value) }}
                    >
                      {categories.map(item => {
                        return (<Picker.Item label={item.label} value={item.value} />)
                      })}
                    </Picker>
                  </Item>
                  :
                  <Item style={{ marginTop: 10 }}>
                    <Input
                      placeholder={"Enter new Category name..."}
                      value={fields.category}
                      onChangeText={value => this.handleChange('category', value)}
                    />
                  </Item>
              }

              {/* Deadline Date */}
              <Item>
                <TouchableOpacity onPress={() => this.setState({ show: 'endDate' })}>
                  <Input
                    placeholder={"Select Deadline Date ..."}
                    value={fields.endDate != null ? moment(fields.endDate).format('l') : null}
                    disabled
                  />
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
              <Item>
                <TouchableOpacity onPress={() => this.setState({ show: 'endTime' })}>
                  <Input
                    placeholder={"Select Deadline Time ..."}
                    value={fields.endTime != null ? moment(fields.endTime).format('LT') : null}
                    disabled
                  />
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
              <Item>
                <Input
                  placeholder={"Duration(minutes) ..."}
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
            </Form>
          </Content>
        </Container>

        <TouchableOpacity
          onPress={this.onSubmit}
        >
          <View style={styles.button}>
            <Text style={styles.buttonText}>Submit</Text>
            {dataLoading ? <ActivityIndicator size="large" color="#4158fb" /> : null}
          </View>
        </TouchableOpacity>
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

export default connect(mapStateToProps, { addCalendarEvent, addSlateTask, setCalendarEvents })(AddTaskModal);