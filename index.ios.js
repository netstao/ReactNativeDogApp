/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TabBarIOS
} from 'react-native';

import List from './app/list/index'
import Edit from './app/edit/index'
import Account from './app/account/index'


class dogApp extends Component {
  constructor(props){
    super(props)
    this.state = {
      selectedTab: 'List'
    }
  }

  render() {
    return (
      <TabBarIOS 
      tintColor="#ee735c" barTintColor="#fefefe">
        <Icon.TabBarItemIOS
          iconName='ios-videocam-outline'
          badge={3}
          selectedIconName='ios-videocam'
          selected={this.state.selectedTab === 'List'}
          onPress={() => {
            this.setState({
              selectedTab: 'List',
            });
          }}>
          <List />
        </Icon.TabBarItemIOS>
        <Icon.TabBarItemIOS
          systemIcon="history"
          iconName='ios-recording-outline'
          selectedIconName='ios-recording'
          selected={this.state.selectedTab === 'Edit'}
          onPress={() => {
            this.setState({
              selectedTab: 'Edit'
            });
          }}>
          <Edit />
        </Icon.TabBarItemIOS>
        <Icon.TabBarItemIOS
         iconName='ios-more-outline'
          selectedIconName='ios-more'
          selected={this.state.selectedTab === 'Accout'}
          onPress={() => {
            this.setState({
              selectedTab: 'Accout'
            });
          }}>
          <Account />
        </Icon.TabBarItemIOS>
      </TabBarIOS>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

AppRegistry.registerComponent('dogApp', () => dogApp);
