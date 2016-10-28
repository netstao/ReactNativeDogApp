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
  TabBarIOS,
  Navigator,
  AsyncStorage
} from 'react-native';

import List from './app/list/index'
import Edit from './app/edit/index'
import Login from './app/account/login'
import Account from './app/account/index'


class dogApp extends Component {
  constructor(props){
    super(props)
    this.state = {
      user:null,
      selectedTab: 'Account',
      logined:false
    }
  }

  componentDidMount() {
    this._asyncAppStatus()
  }

  _asyncAppStatus(){
    var that = this
    AsyncStorage.getItem('user')
    .then((data) => {
      var user 
      var newState = {}

      if(data) {
        user = JSON.parse(data)
      }

      if(user && user.accessToken){
        newState.user = user,
        newState.logined = true
      }
      else {
        newState.logined = false
      }

      that.setState(newState)
    })
  }

  _afterLogin(user){
    var userStr = JSON.stringify(user)
    if(user){
      var that = this
      AsyncStorage.setItem('user',userStr)
      .then(()=>{
        that.setState({
          logined:true,
          user:user
        })
      })
    } else {

    }
  }

  _logout () {
    AsyncStorage.removeItem('user')

    this.setState({
      logined:false,
      user:null
    })
  }


  render() {

    if(!this.state.logined){
      return <Login afterLogin={this._afterLogin.bind(this)}/>
    }
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
          <Navigator 
           initialRoute = {{
            name: 'list',
            component: List,
            title:'list'
           }}
           configureScene={(route) => {
            return Navigator.SceneConfigs.FloatFromRight
           }}
           renderScene={(route, navigator) => {
            var Component = route.component
            return <Component {...route.params} navigator={navigator} />
           }}
           />
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
          selected={this.state.selectedTab === 'Account'}
          onPress={() => {
            this.setState({
              selectedTab: 'Account'
            });
          }}>
          <Account user={this.state.user} logout={this._logout.bind(this)} />
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
