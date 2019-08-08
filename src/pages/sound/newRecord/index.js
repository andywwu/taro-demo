import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text, Image, Slider } from '@tarojs/components'
import { formatSeconds } from '../../../tools/time'
import { connect } from '@tarojs/redux'

import './index.scss'

const options = {
  duration: 10000,
  sampleRate: 44100,
  numberOfChannels: 1,
  encodeBitRate: 192000,
  format: 'aac',
  frameSize: 50
}
@connect(({ record }) => ({
  record,
}))
class CreateRecordPage extends Component {
  config = {
    usingComponents: {
      'nav-bar': '../../../components/navigator-bar/navigator-bar' // 书写第三方组件的相对路径
    },
  }
  state = {
    time: 0,
    beginRecord: false,
    total: 0,
    file: null,
    currentTime: 0,
    play: true,
    navbarData: {
      backgroundColor: '#fff', //导航栏背景颜色
      backType: 'backhome', //返回按钮类型
      backImg: 'white', //返回按钮的颜色
      title: '开始录音',
    },
  }
  componentWillMount() {
    this.recorderManager = Taro.getRecorderManager()
    this.recorderManager.onStop((res) => {
      if (res.duration < 2000) {
        wx.showToast({
          title: '录音时间太短',
          icon: 'none',
          duration: 1000
        })
      } else {
        this.setState({
          total: res.duration / 1000,
          file: res.tempFilePath,
        })
        this.innerAudioContext.src = res.tempFilePath;
        this.innerAudioContext.autoplay = true;
      }
    })
    this.innerAudioContext = wx.createInnerAudioContext()
    this.innerAudioContext.onPlay(() => {
      console.log('开始播放')
    })
    this.innerAudioContext.onTimeUpdate(() => {
      const { currentTime, duration } = this.state
      this.setState({
        currentTime: parseInt(currentTime) === parseInt(duration) ? this.innerAudioContext.duration : this.innerAudioContext.currentTime,
        total: this.innerAudioContext.duration,
      })
    })
    this.innerAudioContext.onEnded(() => {
      this.setState({
        currentTime: 0,
        play: false,
      })
    })
  }
  actionRecord = (action) => {
    if (action) {
      this.innerAudioContext.pause()
    } else {
      this.innerAudioContext.play()
    }
    this.setState({
      play: !action,
    })
  }
  handleSubmitRecord = () => {
    wx.showLoading({
      title: '上传中...',
    })
    this.props.dispatch({
      type: 'ADDRECORD',
      payload: {
        openSound: false,
        checked: false,
        day: '2019.04.24',
        musicLength: this.state.total,
        play: false,
        playTime: 0,
        src: this.state.file,
      },
    })
    setTimeout(() => {
      wx.navigateBack({
        delta: 1,
      })
    }, 1000)
  }
  handleRecordStart = (e) => {
    e.stopPropagation();
    this.setState({
      beginRecord: true,
    })
    this.recorderManager.start(options)
    this.timer = setInterval(() => {
      if (this.state.time > 9) {
        clearInterval(this.timer)
        this.recorderManager.stop()
        this.setState({
          time: 0,
          beginRecord: false,
        })
      } else {
        this.setState({
          time: this.state.time += 1,
        })
      }
    }, 1000)
  }
  handleRecordEnd = (e) => {
    e.stopPropagation();
    clearInterval(this.timer)
    this.recorderManager.stop()
    this.setState({
      beginRecord: false,
      time: 0,
    })
  }
  componentWillUnmount() {
    if (this.innerAudioContext) {
      this.innerAudioContext.destroy()
    }
    if (this.recorderManager) {
      this.recorderManager.stop()
    }
  }
  componentDidHide() { }
  render() {
    const { beginRecord, file, currentTime, total, play } = this.state
    return (
      <View className='record-wrap'>
        <nav-bar
          title={navbarData.title}
          background={navbarData.backgroundColor}
          back
          fixed
          redirectUrl='test'
          onTap={this.testTap}
        />
        {!file ? (
          <View style={{ textAlign: 'center' }}>
            <View className='record-time'>
              <Text>{formatSeconds(this.state.time)}</Text>
            </View>
            <View className='record-action'>
              <Image className={beginRecord ? 'animation' : null} src='https://mxchip-test.oss-cn-shanghai.aliyuncs.com/img_sources/sound-ring@2x.png' />
              <Image
                src='https://mxchip-test.oss-cn-shanghai.aliyuncs.com/img_sources/microphone@2x.png'
                onTouchstart={this.handleRecordStart}
                onTouchEnd={this.handleRecordEnd}
              />
            </View>
            <Text className='record-tip'>
              按住-开始录音，松开-停止录音。
            </Text>
          </View>
        ) : (
            <View>
              <View className='play-content'>
                {play ? (
                  <Image
                    src='https://mxchip-test.oss-cn-shanghai.aliyuncs.com/img_sources/update_pause@2x.png'
                    className='play-ico'
                    onClick={() => this.actionRecord(true)}
                  />
                ) : (
                    <Image
                      src='https://mxchip-test.oss-cn-shanghai.aliyuncs.com/img_sources/broadcast_small@2x.png'
                      className='play-ico'
                      onClick={() => this.actionRecord(false)}
                    />
                  )}
                <Text>{formatSeconds(currentTime)}</Text>
                <View className='play-process'>
                  <Slider
                    step={1}
                    value={parseInt(currentTime)}
                    max={parseInt(total)}
                    min={0}
                    activeColor='#C9062C'
                    backgroundColor='#e9e9e9'
                    blockColor='#C9062C'
                    blockSize={12}
                  />
                </View>
                <Text>{formatSeconds(total)}</Text>
              </View>
              <View className='play-footer'>
                <Button
                  className='reply-record'
                  onClick={() => this.setState({ file: null })}
                >
                  重新录制
              </Button>
                <Button
                  className='play-submit'
                  onClick={this.handleSubmitRecord}
                >
                  确定
              </Button>
              </View>
            </View>
          )}
      </View>
    )
  }
}

export default CreateRecordPage
