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
  ListView,
  TouchableHighlight,
  Image,
  Dimensions,
  ActivityIndicator,
  RefreshControl
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import request from '../common/request'
import config from '../common/config'

const width = Dimensions.get('window').width;

var cachedResults = {
  nextPage: 1,
  items: [],
  total: 0
}

class Item extends Component {

  constructor(props) {
    super(props)
    var row = this.props.row
    this.state = {
      up: row.voted,
      row: row
    }
  }

  render () {
    var rowData = this.state.row
    return (
      <TouchableHighlight>
        <View style={styles.item}>
          <Text style={styles.title}>{rowData.title}</Text>
          <Image source={{uri: rowData.thumb}} 
                 style={styles.thumb}>
                 <Icon
                   name="ios-play"
                   size={28}
                   style={styles.play}
                 />
          </Image>
          <View style={styles.itemFooter}>
            <View style={styles.handleBox}>
              <Icon
                name="ios-heart-outline"
                size={28}
                style={styles.up} />
                <Text style={styles.handleText}>喜欢</Text>
            </View>
            <View style={styles.handleBox}>
              <Icon
                name="ios-chatboxes-outline"
                size={28}
                style={styles.commentIcon} />
                <Text style={styles.handleText}>评论</Text>
            </View>

          </View>
        </View>
      </TouchableHighlight>
      )
  }
}

class List extends Component {

  ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
  state = {
    refReshing : false,
    isLoading: false,
    dataSource: this.ds.cloneWithRows([])
  }

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this._fetchData(1)
  }

  _fetchData(page){

    if(page !== 0){
      this.setState({
        isLoading: true
      })
    } else {
      this.setState({
        refReshing: true
      })
    }

    request.get(config.api.base + config.api.list, {
      accountToken: '111',
      page: page
    })
      .then((data) => {
        if(data.success){
          var items = cachedResults.items.slice()
          if(page !== 0){
            items = items.concat(data.data)
            cachedResults.nextPage += 1
          } else {
            items = data.data.concat(items)
          }
          cachedResults.items = items
          cachedResults.total = data.total
          if(page !== 0){
            this.setState({
              dataSource: this.state.dataSource.cloneWithRows(cachedResults.items),
              isLoading:false
            })
          } 
          else {
             this.setState({
              dataSource: this.state.dataSource.cloneWithRows(cachedResults.items),
              refReshing: false
            })
          }
        }
        console.log(data);
      })
      .catch((error) => {
        if(page !== 0) {
          this.setState({
            isLoading:false
          })
        } 
        else {
          this.setState({
            refReshing:false
          })
        }
        
        console.warn(error);
      });
  }

  _renderRow (rowData) {

    return (
      <Item row={rowData} />
    )
  }

  _fetchMoreData () {
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

  _onRefresh () {
    if(!this._hasMore() || this.state.refReshing){
      return
    }
    this._fetchData(0)
  }

  render() {
    return(
    <View style={styles.container}>
       <View style={styles.header}>
        <Text style={styles.headerTitle}>列表页面</Text>
       </View>
       <ListView
      dataSource={this.state.dataSource}
      renderRow={this._renderRow.bind(this)}
      refreshControl={
        <RefreshControl
            onRefresh={this._onRefresh.bind(this)}
            refreshing={this.state.refReshing}
        />
      }
      automaticallyAdjustContentInsets={false}
      enableEmptySections={true}
      onEndReachedThreshold={20}
      
      onEndReached={this._fetchMoreData.bind(this)}
      renderFooter={this._readerFooter.bind(this)}
      showsVerticalScrollIndicator={false}
    />
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
    paddingTop: 25,
    paddingBottom: 12,
    backgroundColor: '#ee735c',
  },
  headerTitle: {
    textAlign: 'center',
    color: '#fff',
    fontSize:16,
    fontWeight:'600',
    marginBottom: 5,
  },
  item: {
    width: width,
    marginBottom: 10,
    backgroundColor: '#fff'
  },
  thumb:{
    width:width,
    height: width * 0.56,
    resizeMode: 'cover'
  },
  title: {
    color:'#333',
    padding: 10,
    fontSize: 18
  },
  itemFooter:{
    flexDirection:'row',
    justifyContent:'space-between',
    backgroundColor:'#eee'
  },
  handleBox: {
    padding:10,
    flexDirection: 'row',
    width: width / 2 - 0.5,
    justifyContent:'center',
    backgroundColor:'#fff'
  },
  play: {
    position: 'absolute',
    bottom:14,
    right:14,
    width:46,
    height:46,
    paddingTop:9,
    paddingLeft:18,
    backgroundColor:'transparent',
    borderColor:'#fff',
    borderWidth:1,
    borderRadius:23,
    color:'#ed7b66'
  },
  handleText:{
    paddingLeft:12,
    fontSize:18,
    color:'#333'
  },
  up:{
    fontSize:22,
    color:'#333'
  },
  commentIcon:{
    fontSize:22,
    color:'#333'
  },
  loadingMore: {
    marginVertical: 20
  },
  loadingText: {
    color: '#777',
    textAlign:'center'
  }
});

export { List  as default } ;
