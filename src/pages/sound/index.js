import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text, Image, Slider } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import {
  AtList,
  AtListItem,
  AtModal,
  AtModalHeader,
  AtModalContent,
  AtModalAction,
} from "taro-ui"
import { formatSeconds } from '../../tools/time'
import './index.scss'

@connect(({ global, record }) => ({
  global,
  record,
}), (dispatch) => ({
}))
class SoundsPage extends Component {
  config = {
    usingComponents: {
      'nav-bar': '../../../components/navigator-bar/navigator-bar' // 书写第三方组件的相对路径
    },
  }
  state = {
    currentTime: 0,
    total: 0,
    removeId: null,
    modalVisible: false,
    recordAuth: false,
    recordVisible: false,
    navbarData: {
      backgroundColor: '#f5f5f5', //导航栏背景颜色
      backType: 'backhome', //返回按钮类型
      backImg: 'white', //返回按钮的颜色
      title: '语音',
    },
  }
  componentWillMount() {
    console.log('onload')
    const _ = this;
    this.innerAudioContext = wx.createInnerAudioContext()
    this.innerAudioContext.onPlay(() => {
      console.log('开始播放')
    })
    this.innerAudioContext.onTimeUpdate(() => {
      this.setState({
        currentTime: this.innerAudioContext.currentTime,
        total: this.innerAudioContext.duration,
      })
    })
    this.innerAudioContext.onEnded(() => {
      const { recordList } = this.props.record
      recordList.map(item => item.play = false)
      this.props.dispatch({
        type: 'SAVERECORD',
        payload: {
          recordList,
        },
      })
      this.setState({
        currentTime: 0,
        // recordList: this.state.recordList,
      })
    })
    wx.getSetting({
      success: res => {
        if (!res.authSetting['scope.record']) {
          wx.authorize({
            scope: 'scope.record',
            success() {
              _.setState({
                recordAuth: true,
              })
            },
            fail() {
              _.setState({
                recordAuth: false,
              })
            }
          })
        } else {
          _.setState({
            recordAuth: true,
          })
        }
      }
    })
  }
  componentWillUnmount() {
    this.innerAudioContext.destroy()
  }
  componentDidHide() { }
  openRecordFn = () => {
    const _ = this;
    wx.openSetting({
      success(res) {
        _.setState({
          recordAuth: res.authSetting['scope.record'],
        })
      },
    })
    this.setState({
      recordVisible: false,
    })
  }
  handleChange = (e) => {
    this.setState({
      recordVisible: true,
    })
  }
  openDelModal(e) {
    this.setState({
      removeId: e,
      modalVisible: true,
    })
  }
  handleDelRecord = () => {
    this.innerAudioContext.stop()
    this.props.dispatch({
      type: 'REMOVERECORD',
      payload: this.state.removeId,
    })
    this.setState({
      modalVisible: false,
    })
  }
  playRecord = (player) => {
    if (player.id !== this.state.id) {
      this.innerAudioContext.stop()
      this.setState({
        id: player.id,
        currentTime: 0,
      })
    }
    this.innerAudioContext.src = player.src;
    if (!player.play) {
      this.innerAudioContext.play();
    } else {
      this.innerAudioContext.pause();
    }
    this.props.dispatch({
      type: 'CHANGERECORDSTATUS',
      payload: player.id,
    })
  }
  handleAddRecord = () => {
    Taro.navigateTo({
      url: '/pages/sound/newRecord/index',
    })
  }
  changePlayTime = (e) => {
    this.innerAudioContext.seek(e.detail.value)
  }
  percentFilter = (item) => {
    return 100 - (item.musicLength - item.playTime) / item.musicLength * 100;
  }
  render() {
    const { global, record } = this.props
    const { currentTime, total, id, modalVisible, recordAuth, recordVisible, navbarData } = this.state
    const { recordList } = record
    console.log(recordAuth)
    return (
      <View className='voice-wrap'>
        <nav-bar
          title={navbarData.title}
          background={navbarData.backgroundColor}
          fixed
          back
        />
        <View className='voice-main'>
          <AtList>
            <AtListItem
              title='是否开启语音功能'
              switchColor='#C9062C'
              isSwitch
              switchIsCheck={recordAuth}
              onSwitchChange={this.handleChange}
            />
          </AtList>
        </View>
        {recordAuth && (
          <View className='voice-list'>
            <View className='list-warp'>
              {recordList.map((item) => {
                return item.openSound ? (
                  <AtList key={item.id}>
                    <AtListItem
                      className='voice-list-item'
                      key={item.id}
                      title={`录音${item.id}`}
                    />
                  </AtList>
                ) : (
                    <View
                      key={item.id}
                      className='play-card'
                    >
                      <View style={{ padding: '24rpx' }}>
                        <View className='play-title'>
                          录音{item.id}
                        </View>
                        <View className='play-info'>
                          <Text>{item.day}</Text>
                          <Text>{item.musicLength}</Text>
                        </View>
                        <View className='play-content'>
                          {
                            item.play ? (
                              <Image
                                src='https://mxchip-test.oss-cn-shanghai.aliyuncs.com/img_sources/update_pause@2x.png'
                                className='play-ico'
                                onClick={() => this.playRecord(item)}
                              />
                            ) : (
                                <Image
                                  src='https://mxchip-test.oss-cn-shanghai.aliyuncs.com/img_sources/broadcast_small@2x.png'
                                  className='play-ico'
                                  onClick={() => this.playRecord(item)}
                                />
                              )
                          }
                          <Text>{item.id === id ? formatSeconds(currentTime) : '00:00'}</Text>
                          <View className='play-process'>
                            {item.id === id ? (
                              <Slider
                                step={1}
                                value={parseInt(currentTime)}
                                max={parseInt(total)}
                                activeColor='#C9062C'
                                backgroundColor='#e9e9e9'
                                blockColor='#C9062C'
                                blockSize={12}
                                onChange={e => this.changePlayTime(e)}
                              />
                            ) : (
                                <Slider
                                  step={1}
                                  value={0}
                                  max={0}
                                  activeColor='#C9062C'
                                  backgroundColor='#e9e9e9'
                                  blockColor='#C9062C'
                                  blockSize={12}
                                  onChange={e => this.changePlayTime(e)}
                                />
                              )}
                          </View>
                          <Text>{item.id === id ? formatSeconds(total) : '00:00'}</Text>
                        </View>
                      </View>
                      <View className='play-footer'>
                        <Image
                          src='https://mxchip-test.oss-cn-shanghai.aliyuncs.com/img_sources/delete@2x.png'
                          onClick={() => this.openDelModal(item.id)}
                        />
                      </View>
                    </View>
                  )
              })}
            </View>
            <View className='addbtn-wrap'>
              <Button
                className='add-record'
                onClick={this.handleAddRecord}
              >
                新增录音
              </Button>
            </View>
          </View>
        )}
        <AtModal
          isOpened={modalVisible}
          cancelText='取消'
          confirmText='确认'
          onCancel={() => this.setState({ modalVisible: false })}
          onConfirm={this.handleDelRecord}
          content='是否要删除该录音'
        />
        <AtModal isOpened={recordVisible}>
          <AtModalHeader>权限设置</AtModalHeader>
          <AtModalContent>
            是否要进入到录音设置页面？
          </AtModalContent>
          <AtModalAction>
            <Button onClick={() => { this.setState({ recordVisible: false }) }}>取消</Button>
            <Button onClick={() => this.openRecordFn()}>确定</Button>
          </AtModalAction>
        </AtModal>
      </View>
    )
  }
}

export default SoundsPage
