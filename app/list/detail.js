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
  Dimensions,
  ActivityIndicator,
  TouchableOpacity
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
      muted: false,
      resizeMode: 'contain',
      repeat: false,
      videoLoaded: false,
      videoProgress: 0,
      videoTotal:0,
      currentTime:0,
      playing:false,
      paused:false,
      videoOk: true
    }
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
  _onProgress(data){
    if (!this.state.videoLoaded){
      this.setState({
        videoLoaded : true,
        paused:true
      })
    }
    var duration = data.playableDuration
    var currentTime = data.currentTime
    var percent = Number(currentTime/duration).toFixed(2)
    var newState = {
      videoTotal: duration,
      currentTime: Number(data.currentTime.toFixed(2)),
      videoProgress:percent
    }

    if (!this.state.videoLoaded){
      newState.videoLoaded  = true
    }
    if (this.state.videoLoaded){
      newState.playing  = true
    }
    this.setState(newState)
    console.log('load _onProgress',data)

  }

  _onEnd () {
    this.setState({
      videoProgress: 1,
      playing:false
    })
    console.log('load _onEnd')

  }
  _onError(){
    this.setState({
      videoOk:false
    })
    console.log('load _onError')

  }

  _rePlay(){
    this.refs.videoPlayer.seek(0)
  }

  _pause () {
    if(!this.state.paused) {
      this.setState({
        paused : true
      })
    }
    
  }

  _resume() {
     if(this.state.paused) {
      this.setState({
        paused : false
      })
    }
  }
  _pop(){

  }
  render() {
    var data = this.state.data
    console.log(data)
    return(
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBox} onPress={this._backToList.bind(this)}>
            <Icon name='ios-arrow-back' style={styles.backIcon} />
            <Text style={styles.backText}>返回</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle} numberOflines={2}>{data.title}</Text>
        </View>
      <View style={styles.videoBox}>
        <Video
          ref="videoPlayer"
          source={{uri: data.video}}
          style={styles.video}
          volume={5}
          paused={this.state.paused}
          rate={this.state.rate}
          muted={this.state.muted}
          resizeMode={this.state.resizeMode}
          repeat={this.state.repeat}

          onLoadStart={this._onLoadStart.bind(this)}
          onLoad={this._onLoad.bind(this)}
          onProgress={this._onProgress.bind(this)}
          onEnd={this._onEnd.bind(this)}
          onError={this._onError.bind(this)}
          />
          {
            !this.state.videoOk && <Text style={styles.failText}>视频出错了！很抱歉</Text>
          }

          {
            !this.state.videoLoaded && <ActivityIndicator color='#ee735c' style={styles.loading}/>
          }

          {
            this.state.videoLoaded && !this.state.playing
            ? <Icon
              onPress={this._rePlay.bind(this)} name='ios-play' size={48} style={styles.playIcon}/> : null
          }

          {
            this.state.videoLoaded && this.state.playing
            ? <TouchableOpacity onPress={this._pause.bind(this)} style={styles.pauseBtn}>
            {
              this.state.paused
              ?<Icon onPress={this._resume.bind(this)} size={48} name='ios-play' style={styles.resumeIcon} />
              : <Text></Text>
            }
            </TouchableOpacity>
            : null
          }
          <View style={styles.progressBox}>
            <View style={[styles.progressBar, {width: width * this.state.videoProgress}]}></View>
          </View>
        </View>
    </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems:'center',
    width:width,
    height:64,
    paddingTop:20,
    paddingLeft:10,
    paddingRight:10,
    borderBottomWidth:1,
    borderColor:'rgba(0, 0, 0, 0.1)',
    backgroundColor:'#fff'
  },
  backBox:{
    position:'absolute',
    left:12,
    top:32,
    width:50,
    flexDirection:'row',
    alignItems:'center'
  },
  headerTitle:{
    width:width - 120,
    textAlign:'center'
  },
  backIcon:{
    color:'#999',
    fontSize:20,
    marginRight:5
  },
  backText:{
    color:'#999',
    marginBottom:2
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
  },
  loading:{
    position: 'absolute',
    left:0,
    top:140,
    width:width,
    alignSelf: 'center',
    backgroundColor:'transparent'
  },
  progressBox: {
    width:width,
    height:2,
    backgroundColor:'#ccc'
  },
  progressBar:{
    width:1,
    height:2,
    backgroundColor:'#ff6600'
  },
  playIcon:{
    position: 'absolute',
    top:140,
    left:width/2 -30,
    width:60,
    height:60,
    paddingTop:7,
    paddingLeft:22,
    backgroundColor:'transparent',
    borderColor:'#fff',
    borderWidth:1,
    borderRadius:30,
    color:'#ed7b66'
  },
  pauseBtn:{
    position:'absolute',
    left:0,
    top:0,
    width:width,
    height:360
  },
  resumeIcon:{
    position: 'absolute',
    top:140,
    left:width/2 -30,
    width:60,
    height:60,
    paddingTop:7,
    paddingLeft:22,
    backgroundColor:'transparent',
    borderColor:'#fff',
    borderWidth:1,
    borderRadius:30,
    color:'#ed7b66'
  },
  failText:{
    position: 'absolute',
    left:0,
    top:180,
    width:width,
    color:'#fff',
    textAlign: 'center',
    backgroundColor:'transparent'
  }
});

export { Detail as default };
