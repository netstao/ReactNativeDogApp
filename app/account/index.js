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
  Platform,
  AlertIOS,
  Modal,
  TextInput
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import * as Progress from 'react-native-progress';
import ImagePicker from 'react-native-image-picker';
import Button from 'react-native-button';
import sha1 from 'sha1';
import request from '../common/request'
import config from '../common/config'

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
};


function avatar(id, type, v) {
  if (id.indexOf('http') > -1) {
    return id
  }
  if (id.indexOf('data:image') > -1) {
    return id
  }
  if (id.indexOf('avatar/') > -1) {
    return config.cloudinary.base + '/' + type + 'upload/v'+ v + id
  }

  return 'http://ofpfhpkbp.bkt.clouddn.com/' + id
}

class Account extends Component {

  constructor(props) {
    super(props)
    var user = this.props.user || {}
    this.state = {
      user: user,
      avatarProgress: 0,
      avatarUploading: false,
      modalVisible: false
    }
  }
  _edit() {
    this.setState({
      modalVisible:true
    })
  }
  _closeModal(){
    this.setState({
      modalVisible:false
    })
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
        user = data
        console.log(data)
      }
      if(user && user.accessToken){
        newState.user = user
      }
      console.log(newState)
      that.setState(newState)
    })
  }

  getQiniuToken () {
     request.post(signatureURL ,{
        accessToken :accessToken,
        timestamp: timestamp,
        type: 'avatar'
      })
      .then((data) => {
        console.log(data)
        if(data && data.success) {

          var signature = data.data

          var body = new FormData()

          body.append('timestamp', timestamp)
          body.append('folder', folder)
          body.append('signature', signature)
          body.append('tags', tags)
          body.append('api_key', config.cloudinary.api_key)
          body.append('resource_type', 'image')
          body.append('file',  avartarData)

          that._upload(body)
        }
      })
  }

   _getQiniuToken () {

   var accessToken = this.state.user.accessToken
   var signatureURL = config.api.base + config.api.signature
   return request.post(signatureURL ,{
      accessToken :accessToken,
      cloud: 'qiniu'
    })
    .catch((err) => {
      console.log(err)
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

      var timestamp = Date.now()
      var tags = 'app,avatar'
      var folder = 'avatar'
      
      

      var uri = response.uri

     

      that._getQiniuToken()
        .then((data) => {
          console.log(data)
          if(data && data.success) {
            var token = data.data.token
            var key = data.data.key

            var body = new FormData()

            body.append('token', token)
            body.append('key', key)
            body.append('file',  {
              type: 'image/jpeg',
              uri: uri,
              name :key
            })

            that._upload(body)
          }
      })

     // request.post(signatureURL ,{
     //    accessToken :accessToken,
     //    timestamp: timestamp,
     //    type: 'avatar'
     //  })
     //  .then((data) => {
     //    console.log(data)
     //    if(data && data.success) {

     //      var signature = data.data

     //      var body = new FormData()

     //      body.append('timestamp', timestamp)
     //      body.append('folder', folder)
     //      body.append('signature', signature)
     //      body.append('tags', tags)
     //      body.append('api_key', config.cloudinary.api_key)
     //      body.append('resource_type', 'image')
     //      body.append('file',  avartarData)

     //      that._upload(body)
     //    }
     //  })
    })
  }

  _upload (body) {
    console.log('body',body)
    var xhr = new XMLHttpRequest()
    var url = config.qiniu.upload
    var that = this
    that.setState({
      avatarUploading:true,
      avatarProgress:0
    })

    xhr.open('POST', url)
    
    xhr.onload = () => {
      if(xhr.status !== 200){
        AlertIOS.alert('请求失败' + xhr.status)
        console.log(JSON.parse(xhr.response))
        return
      }

      if(!xhr.responseText) {
        AlertIOS.alert('请求失败' + xhr.responseText)
        return
      }

      
      var response
      try {
        response = JSON.parse(xhr.response)
      }
      catch (e) { 
        console.log(e)
      }
      console.log(response)
      if(response) {

        var user = this.state.user
        if(response.public_id) {
          user.avatar = response.url
        }

        if(response.key) {
          user.avatar = response.key
        }
      
        that.setState({
          avatarUploading:false,
          avatarProgress:0,
          user:user
        })
        that._asyncUser(true)
      }
    }
    
    if (xhr.upload) {
      xhr.upload.onprogress = (event) => {
        if(event.lengthComputable) {
          var percent = Number((event.loaded / event.total).toFixed(2))
          console.log(percent)
          that.setState({
            avatarProgress: percent
          })
        }
      }
    }
    
    xhr.send(body)
  }

  _asyncUser (isAvatar) {
    var that = this
    var user = this.state.user
    if ( user && user.accessToken) {
      var url = config.api.base + config.api.update
      console.log(url,11111)
      request.post(url, user)
      .then((data) => {
        console.log(data,22)
        if(data && data.success) {
          var user = data.data
          console.log(user)
          if(isAvatar) {
            AlertIOS.alert('头像更新成功')
          }
          that.setState({
            user: user
          }, function() {
            that._closeModal()
            AsyncStorage.setItem('user', JSON.stringify(user))
          })
        }
      })
    }
  }
  _changeUserState (key, value) {
    var user = this.state.user
    user[key] = value
    this.setState({
      user:user
    })

  }
  _submit () {
    this._asyncUser(false)
  }
  _logout () {
    this.props.logout()
  }

  render() {
    var user = this.state.user
    return(
    <View style={styles.container}>
      <View style={styles.toolbar}>
      <Text style={styles.toolbarTitle}>狗狗账户</Text>
      <Text style={styles.toolbarEdit} onPress={this._edit.bind(this)}>编辑</Text>
      </View>

      {
        user.avatar
        ?
        <TouchableOpacity onPress={this._pickerPhoto.bind(this)} style={styles.avatarContainer}>
          <Image source={{uri: avatar(user.avatar, 'image')}} 
                 style={styles.avatarContainer}>
            <View style={styles.avatarBox}>
            {
            this.state.avatarUploading
            ? <Progress.Circle 
             size={75} 
             showsText={true} 
             color={'#ee735c'} 
             progress={this.state.avatarProgress} 
             />
            :<Image
              source={{uri: avatar(user.avatar, 'image')}}
              style={styles.avatar} />
          }
            
            </View>
            <Text style={styles.avatarTip}>戳这里换头像</Text>
          </Image>
          
        </TouchableOpacity>
        : <TouchableOpacity onPress={this._pickerPhoto.bind(this)} style={styles.avatarContainer}>
        <Text style={styles.avatarTip}>添加狗狗头像</Text>
        <View style={styles.avatarBox}>
          {
            this.state.avatarUploading
            ? <Progress.Circle 
            size={75} 
            showsText={true} 
            color={'#ee735c'} 
            progress={this.state.avatarProgress} 
            />
            :<Icon 
            name='ios-cloud-upload-outline'
            style={styles.plusIcon}/>
          }
          
        </View>
        </TouchableOpacity>
      }

       <Button
             style={styles.btn}
             onPress={this._logout.bind(this)}>退出登录</Button>
      <Modal
      animationType={'fade'}
      visible={this.state.modalVisible}>
      <View style={styles.modalContainer}>
      <Icon
        name='ios-close-outline'
        style={styles.colseIcon} onPress={this._closeModal.bind(this)} />
        <View  style={styles.fieldItem} >
          <Text style={styles.label}>昵称</Text>
          <TextInput 
          placeholder={'输入您的昵称'}
          style={styles.inputField}
          autoCapitalize={'none'}
          autoCorrect={false}
          defaultValue={user.nickname}
          onChangeText={(text)=>{
            this._changeUserState('nickname', text)
          }}/>
        </View>
        <View  style={styles.fieldItem} >
          <Text style={styles.label}>品种</Text>
          <TextInput 
          placeholder={'狗狗的品种'}
          style={styles.inputField}
          autoCapitalize={'none'}
          autoCorrect={false}
          defaultValue={user.breed}
          onChangeText={(text)=>{
            this._changeUserState('breed', text)
          }}/>
        </View>
        <View  style={styles.fieldItem} >
          <Text style={styles.label}>年龄</Text>
          <TextInput 
          placeholder={'狗狗的年龄'}
          style={styles.inputField}
          autoCapitalize={'none'}
          autoCorrect={false}
          defaultValue={user.age}
          onChangeText={(text)=>{
            this._changeUserState('age', text)
          }}/>
        </View>
        <View  style={styles.fieldItem} >
          <Text style={styles.label}>性别</Text>
          <Icon.Button 
          onPress={() => {
            this._changeUserState('gender', 'male')
          }}
          style={[
            styles.gender,
            user.gender === 'male' && styles.genderChecked
            ]}
            name='ios-paw-outline'>男</Icon.Button>
            <Icon.Button 
          onPress={() => {
            this._changeUserState('gender', 'female')
          }}
          style={[
            styles.gender,
            user.gender === 'female' && styles.genderChecked
            ]}
            name='ios-paw'>女</Icon.Button>
        </View>

        <Button
             style={styles.btn}
             onPress={this._submit.bind(this)}>保存</Button>
      </View>
      </Modal>
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
  },
  modalContainer:{
    flex:1,
    paddingTop:50,
    backgroundColor:'#fff'
  },
  fieldItem:{
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems:'center',
    height:50,
    paddingLeft:15,
    paddingRight:15,
    borderColor:'#eee',
    borderBottomWidth:1,
  },
  label:{
    color:'#ccc',
    marginRight:10
  },
  inputField:{
    height:50,
    flex:1,
    color:'#666',
    fontSize:14
  },
  colseIcon:{
    position:'absolute',
    width:40,
    height:40,
    fontSize:32,
    right:20,
    top:30,
    color:'#ee735c'
  },
  gender:{
    backgroundColor:'#ccc'
  },
  genderChecked:{
    backgroundColor:'#ee735c'
  },
  btn:{
    marginTop:10,
    padding:10,
    backgroundColor:'transparent',
    borderColor:'#ee735c',
    borderWidth:1,
    borderRadius:4,
    color:'#ee735c',
    marginRight:10,
    marginLeft:10
  }
});

export { Account as default };
