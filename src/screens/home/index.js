import React, { Component } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { connect } from 'react-redux';
import MenuImage from "../../components/menu_image";
import { _signOut } from "../../redux/actions/authActions";
import { NavigationActions, StackActions } from 'react-navigation';
import { fetchCalendarEvents } from '../../redux/actions/taskActions';
import moment from 'moment';

class HomeScreen extends Component {

  static navigationOptions = ({ navigation }) => ({
    title: 'Home',
    headerLeft: (
      <MenuImage
        onPress={() => {
          console.log("menu image pressed");
          // navigation.openDrawer();
        }}
      />
    )
  });

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

  getEvents = () => {
    var params = {
      maxResults: 10,
      timeMin: new Date().toISOString()
    };
    console.log( params.timeMin);
    this.props.fetchCalendarEvents(params);
  };

  revokeAccess = () => {
    this.props._signOut();
  };

  onPressAddTask = () => {
    this.props.navigation.navigate('AddTask');
  };

  renderEventsList = (events) => {
    return events.map((item) => {
      return (
        <View style={styles.eventItem}>
          <Text>
            {item.summary}
          </Text>
          <Text>
            Creator : {item.creator.email}
          </Text>
          <Text>
            Start: {moment(item.start.dateTime).format('lll')}
          </Text>
          <Text>
            End: {moment(item.end.dateTime).format('lll')}
          </Text>
        </View>
      );
    });
  };

  render() {
    const userInfo = this.props.userInfo;
    const { isLoading, events } = this.props;
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={{ fontSize: 23 }}>Welcome:{userInfo && userInfo.user ? userInfo.user.name : ""}</Text>
        </View>

        <View style={styles.eventsList}>
          {events.length > 0 ? this.renderEventsList(events) : <Text>No Events</Text>}
        </View>

        <View>
          <TouchableOpacity
            style={styles.button}
            onPress={this.getEvents}
          >
            <View>
              <Text>Fetch Events</Text>
              {isLoading ? <ActivityIndicator size="large" color="white" /> : null}
            </View>
          </TouchableOpacity>


          <TouchableOpacity
            style={styles.button}
            onPress={this.onPressAddTask}
          >
            <Text>AddTask</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={this.revokeAccess}
          >
            <Text>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const mapStateToProps = state => ({
  userInfo: state.auth.userInfo,
  isAuthenticated: state.auth.isAuthenticated,
  events: state.task.events,
  isLoading: state.task.isLoading
});

export default connect(mapStateToProps, { _signOut, fetchCalendarEvents })(HomeScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    marginTop: 100,
    alignSelf: "center"
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  eventsList: {
    alignItems: 'center',
    margin:10
  },
  eventItem: {
    padding: 10,
    backgroundColor: "#20d3d6",
    margin:5
  },
  button: {
    alignItems: "center",
    backgroundColor: "#ef6b91",
    padding: 10,
    margin: 20
  },
  image: {
    marginTop: 15,
    width: 150,
    height: 150,
    borderColor: "rgba(0,0,0,0.2)",
    borderWidth: 3,
    borderRadius: 150
  },
});