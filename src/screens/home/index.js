import React, { Component } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import MyDayScreen from "./tabs/my_day";
import CalendarScreen from "./tabs/calendar";
import AnalyticsScreen from "./tabs/analytics";
import { Container, Tab, Tabs, TabHeading } from 'native-base';
import { connect } from 'react-redux';
import MenuImage from "../../components/menu_image";
import { NavigationActions, StackActions } from 'react-navigation';
import { Images } from '../../theme';

const tabMapping = { 0: 'MY DAY', 1: 'CALENDAR', 2: 'MY PROGRESS' };

class HomeScreen extends Component {

  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;

    return {
      title: params.currentTab ? params.currentTab : tabMapping[0],
      headerTitleStyle: {
        color: "#4158fb",
        fontFamily: "Ubuntu-Bold",
        alignSelf: 'center',
        textAlign: "center",
        flex: 1
      },
      headerLeft:(null),
      headerRight: (
        <MenuImage
          onPress={() => {
            console.log("menu image pressed");
            navigation.openDrawer();
          }}
        />
      )
    }
  };

  componentDidMount() {
    if (this.props.isAuthenticated && this.props.userInfo != null) {
      this.props.navigation.setParams({
        currentTab: tabMapping[0],
      });
    } else {
      this.navigateBack();
    }
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

  // render_dummy = (title) => {
  //   return (
  //     <View><Text>{title}</Text></View>
  //   )
  // };

  handleTabChange(i) {
    this.props.navigation.setParams({
      currentTab: tabMapping[i],
    });
  }

  renderTabs = () => {
    const { params } = this.props.navigation.state;
    let currentTab = params && params.currentTab ? params.currentTab : tabMapping[0];

    return (
      <Tabs
        tabBarPosition="bottom"
        onChangeTab={({ i }) => this.handleTabChange(i)}
        tabBarUnderlineStyle={{ height: 0 }}
      >
        <Tab
          heading={<TabHeading style={currentTab == tabMapping[0] ? styles.activeTabStyle : styles.tabStyle}><View><Image source={Images.home} style={styles.tabIcon} /></View></TabHeading>}
          tabStyle={styles.tabStyle}
          activeTabStyle={styles.activeTabStyle}
          activeTextStyle={styles.activeTextStyle}
        >
          <MyDayScreen navigation={this.props.navigation} />
        </Tab>
        <Tab
          heading={<TabHeading style={currentTab == tabMapping[1] ? styles.activeTabStyle : styles.tabStyle}><View><Image source={Images.calendar} style={styles.tabIcon} /></View></TabHeading>}
          tabStyle={styles.tabStyle}
          activeTabStyle={styles.activeTabStyle}
          activeTextStyle={styles.activeTextStyle}
        >
          <CalendarScreen />
        </Tab>
        <Tab
          heading={<TabHeading style={currentTab == tabMapping[2] ? styles.activeTabStyle : styles.tabStyle}><Image source={Images.clock} style={styles.tabIcon} /></TabHeading>}
          tabStyle={styles.tabStyle}
          activeTabStyle={styles.activeTabStyle}
          activeTextStyle={styles.activeTextStyle}
        >
          <AnalyticsScreen />
        </Tab>
      </Tabs>
    );
  }

  render() {
    return (
      <Container>
        {this.renderTabs()}
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  userInfo: state.auth.userInfo,
  slateInfo: state.auth.slateInfo,
  isAuthenticated: state.auth.isAuthenticated,
});


export default connect(mapStateToProps, {})(HomeScreen);

const styles = StyleSheet.create({
  tabStyle: {
    backgroundColor: "#ffffff",
  },
  activeTabStyle: {
    backgroundColor: "#4158fb",
  },
  tabIcon: {
    height: 30,
    width: 30
  }
});