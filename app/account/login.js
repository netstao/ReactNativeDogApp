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
  TextInput,
  AlertIOS
} from 'react-native';
import Button from 'react-native-button';
import request from '../common/request';
import config from '../common/config';
import Icon from 'react-native-vector-icons/Ionicons';
import CountDown from 'react-native-sk-countdown/CountDownText';

class Login extends Component {

  constructor(props){
    super(props)
    this.state = {
      codeSend: false,
      phoneNumber:'',
      verifyCode:'',
      isLoading:false,
      conuntingDone:false
    }
  }

  _submit(){
    var phoneNumber = this.state.phoneNumber
    var verifyCode = this.state.verifyCode

    if(!phoneNumber || !verifyCode) {
      return AlertIOS.alert('手机号或验证码不能为空')
    }

    var body = {
      phoneNumber: phoneNumber,
      verifyCode: verifyCode
    }
    var that = this
    var verifyURL = config.api.base + config.api.verify
    console.log(verifyURL)
    request.post(verifyURL, body)
    .then((data)=>{
      if(data && data.success){
        console.log(data)
        that.props.afterLogin(data.data)
      }
      else{
        AlertIOS.alert('获取验证码失败，请检查手机是否正确')
      }
    })
    .catch((err) => {
      console.log(err)
      AlertIOS.alert('获取验证码失败，检查网络是否良好')
    })

  }

  _showVerifyCode() {
    this.setState({
      codeSend:true
    })
  }
  _sendVerifyCode(){
    var phoneNumber = this.state.phoneNumber

    if(!phoneNumber) {
      return AlertIOS.alert('手机号不能为空')
    }

    var body = {
      phoneNumber: phoneNumber
    }
    var that = this
    var signupURL = config.api.base + config.api.signup
    console.log(signupURL)
    request.post(signupURL, body)
    .then((data)=>{
      if(data && data.success){
        that._showVerifyCode()
      }
      else{
        AlertIOS.alert('获取验证码失败，请检查手机是否正确')
      }
    })
    .catch((err) => {
      console.log(err)
      AlertIOS.alert('获取验证码失败，检查网络是否良好')
    })

  }

  _conuntingDone() {
    this.setState({
      conuntingDone:true
    })
  }
  render() {
    return(
    <View style={styles.container}>
      <View style={styles.signupBox}>
        <Text style={styles.title}>快速登录</Text>
        <TextInput
          placeholder='输入手机号'
          autoCaptialize={'none'}
          autoCorrect={false}
          keyboardType={'number-pad'}
          style={styles.inputField}
          onChangeText={(text)=>{
            this.setState({
              phoneNumber:text
            })
          }}/>

          {
            this.state.codeSend
            ? <View style={styles.verifyCodeBox}>
              <TextInput
              placeholder='输入验证码'
              autoCaptialize={'none'}
              autoCorrect={false}
              keyboardType={'number-pad'}
              style={styles.inputField}
              onChangeText={(text)=>{
                this.setState({
                  verifyCode:text
                })}

          }
          />
          {
             this.state.conuntingDone
            ? <Button style={styles.countBtn}
             onPress={this._sendVerifyCode.bind(this)}>获取验证码</Button>
            : <CountDown
              style={styles.countBtn}
              countType='seconds' // 计时类型：seconds / date
              auto={true} // 自动开始
              afterEnd={this._conuntingDone.bind(this)} //121313 结束回调
              timeLeft={60} // 正向计时 时间起点为0秒
              step={-1} // 计时步长，以秒为单位，正数则为正计时，负数为倒计时
              startText='获取验证码' // 开始的文本
              endText='获取验证码' // 结束的文本
              intervalText={(sec) => sec + '秒重新获取'} // 定时的文本回调
            />
          }
            </View>
            : null
          }
          {
            this.state.codeSend ?
            <Button
             style={styles.btn}
             onPress={this._submit.bind(this)}>登录</Button>
            : <Button
             style={styles.btn}
             onPress={this._sendVerifyCode.bind(this)}>获取验证码</Button>
          }
      </View>
    </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding:10,
    backgroundColor: '#f9f9f9',
  },
  signupBox:{
    marginTop:30
  },
  title:{
    marginBottom:20,
    color:'#333',
    fontSize:20,
    textAlign:'center',
  },
  inputField:{
    flex:1,
    height:40,
    padding:5,
    color:'#666',
    fontSize:16,
    backgroundColor:'#fff',
    borderRadius:4
  },
  verifyCodeBox:{
    marginTop:10,
    flexDirection:'row',
    justifyContent:'space-between'
  },
  countBtn:{
    width:120,
    height:40,
    padding:10,
    marginLeft:8,
    backgroundColor:'#ee735c',
    borderColor:'#ee735c',
    textAlign:'left',
    fontWeight:'600',
    fontSize:15,
    borderRadius:2,
    color:'#fff'
  },
  btn:{
    marginTop:10,
    padding:10,
    backgroundColor:'transparent',
    borderColor:'#ee735c',
    borderWidth:1,
    borderRadius:4,
    color:'#ee735c'
  }
});

export { Login as default };
