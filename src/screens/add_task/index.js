import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { Container, Header, Content, Form, Item, Input } from 'native-base';
import { connect } from 'react-redux';

class AddTaskScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'Add Task',
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

  render() {
    return (
      <View style={styles.container}>
        <Container>          
          <Content>
            <Form>
              <Item>
                <Input placeholder="Username" />
              </Item>
              <Item>
                <Input placeholder="Password" />
              </Item>
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
});

export default connect(mapStateToProps, {})(AddTaskScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});