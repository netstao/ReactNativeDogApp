/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions
} from 'react-native';
import  Video from 'react-native-video';
import Icon from 'react-native-vector-icons/Ionicons';

const width = Dimensions.get('window').width;

class Detail extends Component {

  constructor(props) {
    super(props);
    this.state={
      data: this.props.data,
      rate: 1,
      muted:true,
      resizeMode: 'contain',
      repeat: false
    }

    this._onLoad = this._onLoad.bind(this);
    this._onProgress = this._onProgress.bind(this);
  }

  _backToList () {
    this.props.navigator.pop()
  }
  _onLoadStart(){
    console.log('load start')

  }
  _onLoad(){
    console.log('load _onLoad')

  }
  _onProgress(){
    console.log('load _onProgress')

  }
  _onEnd(){
    console.log('load _onEnd')

  }
  _onError(){
    console.log('load _onError')

  }

  render() {
    var data = this.state.data
    return(
      <View 
    style={styles.container}>
      <Text onPress={this._backToList.bind(this)}>详情</Text>
      <View style={styles.videoBox}>
        <Video
          ref="videoPlayer"
          source={{uri: data.video}}
          style={styles.video}
          volume={5}
          paused={false}
          rate={this.state.rate}
          muted={this.state.muted}
          resizeMode={this.state.resizeMode}
          repeat={this.state.repeat}

          onLoadStart={this._onLoadStart}
          onLoad={this._onLoad}
          onProgress={this._onProgress}
          onEnd={this._onEnd}
          onError={this.onError}
          />
        </View>
    </View>
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
  videoBox:{
    width:width,
    height:360,
    backgroundColor:'#000'
  },
  video:{
    width:width,
    height:360,
    backgroundColor:'#000'
  }
});

export { Detail as default };
