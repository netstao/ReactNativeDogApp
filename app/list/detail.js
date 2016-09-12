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
  TouchableOpacity,
  ScrollView,
  Image,
  ListView,
  TextInput,
  Modal,
  AlertIOS
} from 'react-native';
import Video from 'react-native-video';
import Button from 'react-native-button';
import Icon from 'react-native-vector-icons/Ionicons';
import request from '../common/request'
import config from '../common/config'

const width = Dimensions.get('window').width;

var cachedResults = {
  nextPage: 1,
  items: [],
  total: 0
}


class Detail extends Component {

  constructor(props) {
    super(props);
    this._setModalVisible.bind(this)
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})


    this.state={
      data: this.props.data,
      dataSource: ds.cloneWithRows([]),
      modalVisible:false,
      animationType:'none',
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
      videoOk: true,
      isLoading:false,
      content:'',
      isSending: false
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
  componentDidMount(){
    this._fetchData(1)
  }

  _fetchData(page){
    this.setState({
      isLoading: true
    })

    var that = this
    var url = config.api.base + config.api.comments
    console.log(url)
    request.get(url, {
      accountToken: '111',
      viedo_id:'12',
      page: page
    })
    .then((data) => {
      if(data.success){
        var items = cachedResults.items.slice()
        items = items.concat(data.data)
        cachedResults.nextPage += 1
        cachedResults.items = items
        cachedResults.total = data.total
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(cachedResults.items)
        })

        setTimeout(() => {
          this.setState({
            isLoading:false
          })
        },20)
      } else {
        console.log(data)
      }
    })
    .catch((error) => {
      that.setState({
        isLoading:false
      })
      
      console.warn(error);
    });
  }

  _fetchMoreData () {
    console.log('loading ', !this._hasMore() || this.state.isLoading)
    if (!this._hasMore() || this.state.isLoading) {
      return
    }

    var page = cachedResults.nextPage
    this._fetchData(page)
  }

  _hasMore() {
    return cachedResults.items.length !== cachedResults.total
  }

  _readerFooter () {
    if (!this._hasMore() && cachedResults.total !== 0) {
      return (
        <View style={styles.loadingMore}>
        <Text style={styles.loadingText}>没有更多了</Text>
        </View>
        )
    }
    if(!this.state.isLoading){
      return (<View style={styles.loadingMore}/>)
    }
    return (
      <ActivityIndicator
        style={styles.loadingMore}
      />
    )
  }


  _renderRow(row) {
    if(row) {
      return (
      <View key={row._id} style={styles.replyBox}>
        <Image style={styles.replyAvatar} source={{uri: row.replyBy.avatar}}/>
          <View style={styles.reply}>
            <Text style={styles.replayNickname}>{row.replyBy.nickname}</Text>
            <Text style={styles.replyContent}>{row.content}</Text>
          </View>
      </View>
      )
    }
  }

  _renderHeader (){
    var data = this.state.data
    return (
      <View style={styles.listHeader}>
        <View style={styles.infoBox}>
          <Image style={styles.avatar} source={{uri: data.author.avatar}}/>
            <View style={styles.descBox}>
              <Text style={styles.nickname}>{data.author.nickname}</Text>
              <Text style={styles.title}>{data.title}</Text>
            </View>
        </View>
        <View style={styles.commentBox}>
          <View style={styles.comment}>
            <TextInput 
            style={styles.content}
            placeholder='好喜欢这个狗狗'
            multiline={true}
            onFocus={this._focus.bind(this)}
            />
          </View>
          <View style={styles.commentArea}>
            <Text style={styles.CommentTitle}>精彩评论</Text>
          </View>
        </View>
      </View>
    )
  }

   _setModalVisible(isVisible){

    this.setState({
      modalVisible:isVisible
    })
  }

  _focus() {
    console.log(this)
    this._setModalVisible(true)
  }

  
  _blur(){

  }
  _closeModal(){
    
    this._setModalVisible(false)
  }

  _submit(){
    if (!this.state.content) {
      return AlertIOS.alert('留言不能为空')
    }

    if(!this.state.isSending) {
      return AlertIOS.alert('正在评论中！')
    }

    this.setState({
      isSending:true
    }, () => {
      var body = {
        accountToken:'1',
        viedo_id:'123',
        content:this.state.content
      }

      var url = config.api.base + config.api.comments

      var that  = this

      request.post(url, body)
      .then((data) => {
        console.log(data)
        if(data && data.success){
          var items = cachedResults.items.slice()
          var content = that.state.content

          items = [{
            content: content,
            replyBy:{
              avatar:'http://dummyimage.com/120x120/d1f279',
              nickname:'狗狗说'
            }
          }].concat(items)

          cachedResults.items = items
          cachedResults.total = cachedResults.total+1

          that.setState({
            content:'',
            isSending:false,
            dataSource:that.state.dataSource.cloneWithRows(cachedResults.items)
          })

          that._setModalVisible(false)
        }
      })
      .catch((error)=>{
        that.setState({
          isSending:false
        })
        that._setModalVisible(false)
        AlertIOS.alert('留言失败，稍后重试')
      })
    })
  }
  render() {
    var data = this.state.data
    return(
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBox} onPress={this._backToList.bind(this)}>
            <Icon name='ios-arrow-back' style={styles.backIcon} />
            <Text style={styles.backText}>返回</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle} numberOflines={2}>视频详情</Text>
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
        <ListView
          dataSource={this.state.dataSource}
          renderRow={this._renderRow.bind(this)}
          renderFooter={this._readerFooter.bind(this)}
          renderHeader={this._renderHeader.bind(this)}
          onEndReached={this._fetchMoreData.bind(this)}
          enableEmptySections={true}
          pageSize={10}
          onEndReachedThreshold={20}
          automaticallyAdjustContentInsets={false}
          showsVerticalScrollIndicator={false}
        />
        <View style={styles.commentArea}>
                  <Text style={styles.CommentTitle}>精彩评论</Text>
                </View>
        <Modal
          animationType={'fade'}
          visible={this.state.modalVisible}
          onRequestClose={() => {this._setModalVisible.bind(this)}}
          >
          <View style={styles.modalContainer}>
            <Icon
             onPress={this._closeModal.bind(this)}
             name='ios-close-outline'
             style={styles.closeIcon}/>
             <View style={styles.commentBox}>
              <View style={styles.comment}>
                <TextInput 
                style={styles.content}
                placeholder='好喜欢这个狗狗'
                multiline={true}
                defaultValue={this.state.content}
                onChangeText={(Text)=>{
                  this.setState({
                    content:Text,
                    isSending:true
                  })
                }}
                />
                </View>
              </View>
              <Button style={styles.submitBtn} onPress={this._submit.bind(this)}>评论</Button>
          </View>
          </Modal>
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
  submitBtn:{
    width: width - 20,
    padding:16,
    marginTop:20,
    marginBottom:20,
    alignSelf:'center',
    borderWidth:1,
    borderColor:'#ee753c',
    borderRadius:4,
    fontSize:18,
    color:'#ee753c'
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
    height:width * 0.56,
    backgroundColor:'#000',
    zIndex:99
  },
  video:{
    width:width,
    height:width * 0.56,
    backgroundColor:'#000'
  },
  loading:{
    position: 'absolute',
    left:0,
    top:80,
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
    top:90,
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
    height:width * 0.56
  },
  resumeIcon:{
    position: 'absolute',
    top:80,
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
    top:90,
    width:width,
    color:'#fff',
    textAlign: 'center',
    backgroundColor:'transparent'
  },
  infoBox:{
    width:width,
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10    
  },
  avatar:{
    width:60,
    height:60,
    marginRight:10,
    marginLeft:10,
    borderRadius:30
  },
  descBox:{
    flex:1
  },
  nickname:{
    fontSize:18
  },
  title:{
    marginTop:8,
    fontSize:16,
    color:'#666'
  },
  replyBox:{
    flexDirection:'row',
    justifyContent:'flex-start',
    marginBottom: 10
  },
  replyAvatar:{
    width:40,
    height:40,
    marginRight:10,
    marginLeft:10,
    borderRadius:20
  },
  replyNickname:{
    color:'#666'
  },
  replyContent:{
    marginTop:4,
    color:'#666'
  },
  reply:{
    flex:1
  },
  loadingMore: {
    marginVertical: 20
  },
  loadingText: {
    color: '#777',
    textAlign:'center'
  },
  commentBox:{
    marginTop:10,
    padding:8,
    width:width
  },
  listHeader:{
    width:width,
    marginTop:10
  },
  content:{
    paddingLeft:2,
    color:'#333',
    borderWidth:1,
    borderColor:'#ddd',
    borderRadius:4,
    fontSize:14,
    height:80,
    paddingLeft:8
  },
  commentArea:{
    width:width,
    marginTop:10,
    paddingBottom:8,
    paddingTop:8,
    paddingLeft:10,
    paddingRight:10,
    borderBottomWidth:1,
    borderBottomColor:'#eee'
  },
  CommentTitle:{
    fontSize:16
  },
  modalContainer:{
    flex:1,
    paddingTop:45,
    backgroundColor:'#fff'
  },
  closeIcon:{
    alignSelf:'center',
    fontSize:30,
    color:'#ee753c'
  }
});

export { Detail as default };
