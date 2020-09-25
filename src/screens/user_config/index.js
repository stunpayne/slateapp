import React, { Component } from 'react';
import { View, TouchableOpacity, ActivityIndicator, StyleSheet, Image } from 'react-native';
import {
  Container, Header, Content, Form, Item, Input, Button, Text, Label, Picker, Icon
  , ListItem, CheckBox, Body, Tab, Tabs, Thumbnail
} from 'native-base';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import { getTimeZoneList } from './timezone_helper';
import { connect } from 'react-redux';
import { updateSlateUser } from '../../redux/actions/authActions';
import BackButton from '../../components/back_button';
import NavigationService from '../../services/NavigationService';
import { styles } from './userConfigStyles';
import { Images } from '../../theme';

const tabMapping = { 0: 'SETTINGS', 1: 'PROFILE' };

class UserConfigurationScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'PREFERENCES',
    headerTitleStyle: {
      color: "#4158fb",
      fontFamily: "Ubuntu-Bold",
      alignSelf: 'center',
      textAlign: "center",
      flex: 1
    },
    headerLeft: (
      <BackButton
        onPress={() => {          
          NavigationService.navigate("Home");
        }}
      />
    ),
    headerRight:(
      <View />
    )
  });

  constructor(props) {
    super(props);

    this.state = {
      fields: {},
      errors: {},
      show: null,
      dataLoading: false,
      timezones: [],
      push_notifications: false
    };
  }

  componentDidMount() {
    this.populateForm();
  };

  populateForm = () => {
    let timezones = getTimeZoneList();
    let fields = {};
    // console.log("this.props", this.props.slateInfo);
    fields.name = this.props.slateInfo && this.props.slateInfo.name ? this.props.slateInfo.name : null;
    fields.timezone = this.props.slateInfo && this.props.slateInfo.default_timezone ? this.props.slateInfo.default_timezone : null;
    fields.profession = this.props.slateInfo && this.props.slateInfo.profession ? this.props.slateInfo.profession : null;
    let push_notifications = false;

    if (this.props.slateInfo && this.props.slateInfo.preferences) {
      if (this.props.slateInfo.preferences.working_hours) {
        let wh = this.props.slateInfo.preferences.working_hours;

        let start = new Date();
        start.setHours(parseInt(wh.wh_start.slice(0, 2)));
        start.setMinutes(parseInt(wh.wh_start.slice(3, 5)));

        let end = new Date();
        end.setHours(parseInt(wh.wh_end.slice(0, 2)));
        end.setMinutes(parseInt(wh.wh_end.slice(3, 5)));

        fields.wh_start = start;
        fields.wh_end = end;
      }
      if (this.props.slateInfo.preferences.push_notifications) {
        push_notifications = this.props.slateInfo.preferences.push_notifications;
      }
    };


    this.setState({ timezones, fields, push_notifications });
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
      let profession = fields.profession ? fields.profession : "";
      let push_notifications = this.state.push_notifications;

      // console.log("submit pressed", fields);
      let data = {};
      data.id = this.props.slateInfo.id;
      data.name = fields.name;
      data.default_timezone = fields.timezone;
      data.profession = profession;
      data.preferences = {
        working_hours: {
          wh_start: moment(fields.wh_start).format('HH:mm'),
          wh_end: moment(fields.wh_end).format('HH:mm')
        },
        push_notifications: push_notifications
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

  checkBoxPressed = () => {
    this.setState({ push_notifications: !this.state.push_notifications });
  }

  render() {
    const { errors, fields, show, dataLoading, timezones } = this.state;
    const { isLoading } = this.props;
    const RED_ASTERISK = <Text style={{ color: "#ff0000" }}>*</Text>;

    return (
      <Container>
        <Content>
          <View style={styles.topContainer}>
            <Image
              style={styles.user_profile_image}
              source={Images.user_profile_image}
            />
          </View>

          <Tabs tabBarUnderlineStyle={styles.tabBarUnderlineStyle}>
            <Tab heading={tabMapping[0]}
              tabStyle={styles.tabStyle}
              activeTabStyle={styles.activeTabStyle}
              activeTextStyle={styles.activeTextStyle}
              textStyle={styles.textStyle}
            >
              <View style={{ marginTop: 0 }}>
                <Form>
                  <Item style={styles.item} inlineLabel>
                    <Label>
                      <Text style={styles.label}>Timezone</Text>
                    </Label>

                    <Picker
                      mode="dropdown"
                      iosIcon={<Icon name="arrow-down" />}
                      style={{ padding: 0, margin: 0 }}
                      placeholder="Select your Timezone"
                      placeholderStyle={{ color: "#bfc6ea", margin: 0, padding: 0, margin: 0 }}
                      placeholderIconColor="#007aff"
                      itemTextStyle={styles.input}
                      selectedValue={this.state.fields.timezone}
                      onValueChange={value => this.handleChange('timezone', value)}
                    >
                      {timezones.map(timezone => {
                        return (<Picker.Item label={timezone.label} value={timezone.value} />)
                      })}
                    </Picker>
                  </Item>

                  {/* Working hours Start Time */}
                  <Item style={styles.item} inlineLabel>
                    {/* <TouchableOpacity onPress={() => this.setState({ show: 'wh_start' })}> */}
                    <Label>
                      <Text style={styles.label}>Daily Working Hours Start</Text>
                    </Label>
                    {/* </TouchableOpacity> */}

                    <TouchableOpacity onPress={() => this.setState({ show: 'wh_start' })}>
                      <Input
                        style={styles.input}
                        value={fields.wh_start != null ? moment(fields.wh_start).format('LT') : "--:--"}
                        disabled
                      />
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
                  <Item style={styles.item} inlineLabel>
                    {/* <TouchableOpacity onPress={() => this.setState({ show: 'wh_end' })}> */}
                    <Label>
                      <Text style={styles.label}>Daily Working Hours End</Text>
                    </Label>
                    {/* </TouchableOpacity> */}

                    <TouchableOpacity onPress={() => this.setState({ show: 'wh_end' })}>
                      <Input
                        style={styles.input}
                        value={fields.wh_end != null ? moment(fields.wh_end).format('LT') : "--:--"}
                        disabled
                      />
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


                  <ListItem style={styles.item}>
                    <Body>
                      <Label>
                        <Text style={styles.label}>Receive Notifications</Text>
                      </Label>
                    </Body>
                    <CheckBox checked={this.state.push_notifications} color={'#4158fb'} onPress={e => this.checkBoxPressed()} />
                  </ListItem>


                  <TouchableOpacity
                    onPress={this.onSubmit}
                  >
                    <View style={styles.button}>
                      <Text style={styles.buttonText}>Submit</Text>
                      {dataLoading || isLoading ? <ActivityIndicator size="large" color="#4158fb" /> : null}
                    </View>
                  </TouchableOpacity>

                  {/* <TouchableOpacity
                    onPress={() => { NavigationService.navigateReset("Home") }}
                  >
                    <View style={styles.button}>
                      <Text style={styles.buttonText}>Go to Home</Text>
                    </View>
                  </TouchableOpacity> */}
                </Form>
              </View>
            </Tab>

            <Tab heading={tabMapping[1]}
              tabStyle={styles.tabStyle}
              activeTabStyle={styles.activeTabStyle}
              activeTextStyle={styles.activeTextStyle}
              textStyle={styles.textStyle}
            >

              <View style={{ marginTop: 0 }}>
                <Form>
                  <Item style={styles.item} stackedLabel>
                    <Label>
                      <Text style={styles.label}>Email</Text>
                    </Label>
                    <Input
                      disabled
                      value={this.props.slateInfo && this.props.slateInfo.email ? this.props.slateInfo.email : ""}
                      style={styles.input}
                    />
                  </Item>

                  <Item style={styles.item} stackedLabel>
                    <Label>
                      <Text style={styles.label}>Name</Text>
                    </Label>
                    <Input
                      value={fields.name ? fields.name : ""}
                      onChangeText={value => this.handleChange('name', value)}
                      style={styles.input}
                    />
                  </Item>
                  {errors.name && errors.name.length ? (
                    <Text style={styles.errorTextStyle}>
                      {errors.name}
                    </Text>
                  ) : null}

                  <Item style={styles.item} stackedLabel>
                    <Label>
                      <Text style={styles.label}>Profession</Text>
                    </Label>
                    <Input
                      value={fields.profession ? fields.profession : ""}
                      onChangeText={value => this.handleChange('profession', value)}
                      style={styles.input}
                    />
                  </Item>
                  {errors.profession && errors.profession.length ? (
                    <Text style={styles.errorTextStyle}>
                      {errors.profession}
                    </Text>
                  ) : null}

                  <TouchableOpacity
                    onPress={this.onSubmit}
                  >
                    <View style={styles.button}>
                      <Text style={styles.buttonText}>Submit</Text>
                      {dataLoading || isLoading ? <ActivityIndicator size="large" color="#4158fb" /> : null}
                    </View>
                  </TouchableOpacity>
                </Form>
              </View>
            </Tab>
          </Tabs>
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
