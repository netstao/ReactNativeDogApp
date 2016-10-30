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
  TouchableOpacity,
  Image,
  Dimensions
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Video from 'react-native-video';
import ImagePicker from 'react-native-image-picker';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

var videoOptions = {
  title: '选择视频',
  cancelButtonTitle:'取消',
  takePhotoButtonTitle:'录制10秒视频',
  chooseFromLibraryButtonTitle:'选择已有视频',
  videoQuality: 'medium',
  mediaType:'video',
  durationLimit:10,
  noData:false,
  storageOptions: {
    skipBackup: true,
    path: 'images'
  }
};


class Edit extends Component {

  constructor(props) {
    super(props)
    this.state = {
      previewVideo: null,

      //video play
      rate: 1,
      muted: false,
      resizeMode: 'contain',
      repeat: false,

      //loads
      videoLoaded: false,
      videoProgress: 0,
      videoTotal:0,
      currentTime:0,
      playing:false,
      paused:false,
      videoOk: true
    }
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

   _packVideo () {

    var that = this
    ImagePicker.showImagePicker(videoOptions, (response) => {
      console.log('Response = ', response)

      if (response.didCancel) {
        return 
      }

      
      

      var uri = response.uri

      that.setState({
        previewVideo: uri
      })

     

      // that._getQiniuToken()
      //   .then((data) => {
      //     console.log(data)
      //     if(data && data.success) {
      //       var token = data.data.token
      //       var key = data.data.key

      //       var body = new FormData()

      //       body.append('token', token)
      //       body.append('key', key)
      //       body.append('file',  {
      //         type: 'image/jpeg',
      //         uri: uri,
      //         name :key
      //       })

      //       that._upload(body)
      //     }
      // })


    })
  }

  render() {
    return(
      <View 
    style={styles.container}>
      <View style={styles.toolbar}>
      <Text style={styles.toolbarTitle}>
      {this.state.previewVideo ? '点击按钮配音' :'理解狗狗从配音开始'}
      </Text>
       <Text style={styles.toolbarEdit} onPress={this._packVideo.bind(this)}>更换视频</Text>
      </View>
      <View style={styles.page}>
        {
          this.state.previewVideo
          ? <View style={styles.videoContainer}>
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
              </View>
            </View>
          : <TouchableOpacity  style={styles.uploadContainer} onPress={this._packVideo.bind(this)}>
          <View style={styles.uploadBox}>
            <Image source={require('../assets/images/record.png')} style={styles.uploadIcon} />
            <Text style={styles.uploadTitle}>点我上传视频</Text>
            <Text style={styles.uploadDesc}>建议时长不超过20秒</Text>
          </View>
          </TouchableOpacity>
        }
      </View>
    </View>
    )
  }
}

const styles = StyleSheet.create({
   container: {
    flex: 1
  },
  toolbar:{
    flexDirection:'row',
    paddingTop:25,
    paddingBottom:12,
    backgroundColor:'#ee735c'
  },
  toolbarTitle:{
    flex:1,
    fontSize:16,
    color:'#fff',
    textAlign:'center',

  },
  toolbarEdit:{
    position:'absolute',
    right:10,
    top:26,
    color:'#fff',
    textAlign:'right',
    fontWeight:'600',
    fontSize:14
  },
  page:{
    flex:1,
    alignItems:'center'
  },
  uploadContainer:{
    marginTop:90,
    width:width,
    paddingBottom:10,
    borderWidth:1,
    borderColor:'#ee735c',
    justifyContent:'center',
    borderRadius:6,
    backgroundColor:'#fff'
  },
  uploadTitle:{
    marginBottom:10,
    textAlign:'center',
    fontSize:16,
    color:'#000'
  },
  uploadDesc:{
    color:'#999',
    textAlign:'center',
    fontSize:12
  },
  uploadIcon:{
    width:110,
    resizeMode:'contain'
  },
  uploadBox:{
    flex:1,
    flexDirection:'column',
    justifyContent:'center',
    alignItems:'center'
  },
  videoContainer:{
    width:width,
    justifyContent:'center',
    alignItems:'flex-start'
  },
  videoBox:{
    width:width,
    height:width * 0.6,
  },
  wideo:{
    width:width,
    height:width * 0.6,
    backgroundColor:'#333'
  }
});

export { Edit as default };
