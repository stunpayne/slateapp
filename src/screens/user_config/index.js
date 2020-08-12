import React, { Component } from 'react';
import { View, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { Container, Header, Content, Form, Item, Input, Button, Text, Label, Picker, Icon } from 'native-base';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import { getTimeZoneList } from './timezone_helper';
import { connect } from 'react-redux';
import { updateSlateUser } from '../../redux/actions/authActions';

class UserConfigurationScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'User Config',
  });

  state = {
    fields: {},
    errors: {},
    show: null,
    dataLoading: false,
    timezones: []
  };

  componentDidMount() {
    this.populateForm();
  };

  populateForm = () => {
    let timezones = getTimeZoneList();
    let fields = {};
    fields.name = this.props.slateInfo.name ? this.props.slateInfo.name : null;
    fields.timezone = this.props.slateInfo.default_timezone ? this.props.slateInfo.default_timezone : null;


    if (this.props.slateInfo.preferences && this.props.slateInfo.preferences.working_hours) {
      let wh = this.props.slateInfo.preferences.working_hours;

      let start = new Date();
      start.setHours(parseInt(wh.wh_start.slice(0, 2)));
      start.setMinutes(parseInt(wh.wh_start.slice(3, 5)));

      let end = new Date();
      end.setHours(parseInt(wh.wh_end.slice(0, 2)));
      end.setMinutes(parseInt(wh.wh_end.slice(3, 5)));

      fields.wh_start = start;
      fields.wh_end = end;
    };

    this.setState({ timezones, fields });
  }

  validateForm = () => {
    let fields = this.state.fields;
    let errors = {};
    let formIsValid = true;

    if (!fields['name']) {
      formIsValid = false;
      errors['name'] = "Name is required";
    };

    if (typeof fields['name'] !== 'undefined') {
      if (fields['name'].length == 0) {
        formIsValid = false;
        errors['duration'] = "Valid name is required";
      };
    };

    if (!fields['timezone']) {
      formIsValid = false;
      errors['timezone'] = "Timezone is required";
    };

    if (!fields['wh_start']) {
      formIsValid = false;
      errors['wh_start'] = "Working Hours Start is required";
    };

    if (!fields['wh_end']) {
      formIsValid = false;
      errors['wh_end'] = "Working Hours End is required";
    };

    this.setState({
      errors: errors,
    });
    return formIsValid;
  };

  onSubmit = () => {
    if (this.validateForm()) {
      let fields = this.state.fields;
      // console.log("submit pressed", fields);
      let data = {};
      data.id = this.props.slateInfo.id;
      data.name = fields.name;
      data.default_timezone = fields.timezone;
      data.preferences = {
        working_hours: {
          wh_start: moment(fields.wh_start).format('HH:mm'),
          wh_end: moment(fields.wh_end).format('HH:mm')
        },
        push_notifications: false
      }
      // console.log("data submitteed", data);
      this.props.updateSlateUser(data);
    };
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

  render() {
    const { errors, fields, show, dataLoading, timezones } = this.state;
    const { isLoading } = this.props;
    const RED_ASTERISK = <Text style={{ color: "#ff0000" }}>*</Text>;
    return (
      <Container>
        <Content>
          <View style={{ marginTop: 40 }}>
            <Form>

              <Item floatingLabel>
                <Label>
                  Name {RED_ASTERISK}
                </Label>
                <Input
                  value={fields.name}
                  onChangeText={value => this.handleChange('name', value)}
                />
              </Item>

              <Item style={{ marginTop: 20, padding: 0 }}>
                <Picker
                  mode="dropdown"
                  iosIcon={<Icon name="arrow-down" />}
                  style={{ padding: 0, margin: 0 }}
                  placeholder="Select your SIM"
                  placeholderStyle={{ color: "#bfc6ea", margin: 0, padding: 0, margin: 0 }}
                  placeholderIconColor="#007aff"
                  selectedValue={this.state.fields.timezone}
                  onValueChange={value => this.handleChange('timezone', value)}
                >
                  {timezones.map(timezone => {
                    return (<Picker.Item label={timezone.label} value={timezone.value} />)
                  })}
                </Picker>
              </Item>

              {/* Working hours Start Time */}
              <Item style={{ marginTop: 40 }}>
                <TouchableOpacity onPress={() => this.setState({ show: 'wh_start' })}>
                  <Label>{fields.wh_start != null ? moment(fields.wh_start).format('LT') : <Text>Working Hours Start {RED_ASTERISK}</Text>}</Label>
                </TouchableOpacity>
                {show == 'wh_start' && <DateTimePicker
                  value={fields.wh_start != null ? fields.wh_start : new Date()}
                  mode="time"
                  onChange={e => this.onPickerChange(e, 'wh_start')}
                />}
              </Item>
              {errors.wh_start && errors.wh_start.length ? (
                <Text style={styles.errorTextStyle}>
                  {errors.wh_start}
                </Text>
              ) : null}

              {/* Working hours End Time */}
              <Item style={{ marginTop: 40 }}>
                <TouchableOpacity onPress={() => this.setState({ show: 'wh_end' })}>
                  <Label>{fields.wh_end != null ? moment(fields.wh_end).format('LT') : <Text>Working Hours End {RED_ASTERISK}</Text>}</Label>
                </TouchableOpacity>
                {show == 'wh_end' && <DateTimePicker
                  value={fields.wh_end != null ? fields.wh_end : new Date()}
                  mode="time"
                  onChange={e => this.onPickerChange(e, 'wh_end')}
                />}
              </Item>
              {errors.wh_end && errors.wh_end.length ? (
                <Text style={styles.errorTextStyle}>
                  {errors.wh_end}
                </Text>
              ) : null}

              <TouchableOpacity
                style={styles.button}
                onPress={this.onSubmit}
              >
                <View>
                  <Text>Submit</Text>
                  {dataLoading || isLoading ? <ActivityIndicator size="large" color="white" /> : null}
                </View>
              </TouchableOpacity>
            </Form>
          </View>
        </Content>
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  userInfo: state.auth.userInfo,
  slateInfo: state.auth.slateInfo,
  isLoading: state.auth.isLoading
});

export default connect(mapStateToProps, { updateSlateUser })(UserConfigurationScreen);

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    backgroundColor: "#ef6b91",
    padding: 10,
    margin: 10,
    marginTop: 40
  },
  errorTextStyle: {
    color: "#ff0000",
    marginLeft: 10,
  },
});
