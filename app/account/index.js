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
  Dimensions,
  AsyncStorage,
  Image,
  Platform
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import ImagePicker from 'react-native-image-picker';

const width = Dimensions.get('window').width;

var photoOptions = {
  title: '选择头像',
  cancelButtonTitle:'取消',
  takePhotoButtonTitle:'拍照',
  chooseFromLibraryButtonTitle:'从相册选择',
  quality:0.75,
  allowsEditing:true,
  noData:false,
  storageOptions: {
    skipBackup: true,
    path: 'images'
  }
}
class Account extends Component {

  constructor(props) {
    super(props)
    var user = this.props.user || {}
    this.state = {
      user: user
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
        newState.user = user
      }

      that.setState(newState)
    })
  }

  _pickerPhoto () {

    var that = this
    ImagePicker.showImagePicker(photoOptions, (response) => {
      console.log('Response = ', response)

      if (response.didCancel) {
        return 
      }

      var avartarData = 'data:image/jpeg;base64,'+response.data
      var user = that.state.user
      user.avatar = avartarData

      that.setState({
        user:user
      })
      
    })
  }

  render() {
    var user = this.state.user
    console.log(user)
    return(
    <View style={styles.container}>
      <View style={styles.toolbar}>
      <Text style={styles.toolbarTitle}>我的账户</Text>
      </View>

      {
        user.avatar
        ?
        <TouchableOpacity onPress={this._pickerPhoto.bind(this)} style={styles.avatarContainer}>
          <Image source={{uri: user.avatar}} 
                 style={styles.avatarContainer}>
            <View style={styles.avatarBox}>
            <Image
              source={{uri: user.avatar}}
              style={styles.avatar} />
            </View>
            <Text style={styles.avatarTip}>戳这里换头像</Text>
          </Image>
          
        </TouchableOpacity>
        : <TouchableOpacity onPress={this._pickerPhoto.bind(this)} style={styles.avatarContainer}>
        <Text style={styles.avatarTip}>添加狗狗头像</Text>
        <View style={styles.avatarBox}>
          <Icon 
          name='ios-cloud-upload-outline'
          style={styles.plusIcon}/>
        </View>
        </TouchableOpacity>
      }
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
  avatarContainer:{
    width:width,
    height:140,
    alignItems:'center',
    justifyContent:'center',
    backgroundColor:'#eee'
  },
  avatarTip:{
    color:'#fff',
    backgroundColor:'transparent',
    fontSize:14
  },
  avatarBox:{
    marginTop:15,
    alignItems:'center',
    justifyContent:'center'
  },
  avatar:{
    marginBottom:15,
    width:width *0.2,
    height:width *0.2,
    resizeMode:'cover',
    borderRadius:width*0.1,
    borderWidth:1,
    borderColor:'#ccc'
  },
  plusIcon:{
    padding:20,
    paddingLeft:25,
    paddingRight:25,
    color:'#ee735c',
    fontSize:28,
    backgroundColor:'#fff',
    borderRadius:8
  }
});

export { Account as default };
