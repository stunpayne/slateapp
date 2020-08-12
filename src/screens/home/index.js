import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MyDayScreen from "./tabs/my_day";
import { Container, Tab, Tabs } from 'native-base';
import { connect } from 'react-redux';
import MenuImage from "../../components/menu_image";
import { NavigationActions, StackActions } from 'react-navigation';

const tabMapping = { 0: 'My Day', 1: 'Tab2', 2: 'Tab3' };

class HomeScreen extends Component {

  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;

    return {
      title: params.currentTab ? params.currentTab : tabMapping[0],
      headerTitleStyle:{
        color:"#4158fb",
        fontFamily:"Ubuntu-Medium",
        alignSelf: 'center',
        textAlign:"center", 
        flex:1 
      },
      headerRight: (
        <MenuImage
          onPress={() => {
            console.log("menu image pressed");
            // navigation.openDrawer();
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

  render_dummy = (title) => {
    return (
      <View><Text>{title}</Text></View>
    )
  };

  handleTabChange(i) {
    this.props.navigation.setParams({
      currentTab: tabMapping[i],
    });
  }

  renderTabs = () => {
    return (
      <Tabs tabBarPosition="bottom" onChangeTab={({ i }) => this.handleTabChange(i)} tabBarUnderlineStyle={{ height: 0 }}>
        <Tab heading="MyDay" tabStyle={styles.tabStyle} activeTabStyle={styles.activeTabStyle} activeTextStyle={styles.activeTextStyle}>
          <MyDayScreen navigation={this.props.navigation} />
        </Tab>
        <Tab heading="Tab2" tabStyle={styles.tabStyle} activeTabStyle={styles.activeTabStyle} activeTextStyle={styles.activeTextStyle}>
          {this.render_dummy("Tab2")}
        </Tab>
        <Tab heading="Tab3" tabStyle={styles.tabStyle} activeTabStyle={styles.activeTabStyle} activeTextStyle={styles.activeTextStyle}>
          {this.render_dummy("Tab3")}
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
    backgroundColor: "#ffffff",
  },
  activeTextStyle: {
    color: "#4158fb",
  }
})