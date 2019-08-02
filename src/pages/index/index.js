import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text, Image } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import * as echarts from '../../components/ec-canvas/echarts'
import './index.scss'

function initChart(canvas, width, height) {
  const chart = echarts.init(canvas, null, {
    width: width,
    height: height
  });
  canvas.setChart(chart);
  var option = {
    grid: {
      left: 20,
      right: 20,
      top: 40,
      bottom: 20,
    },
    tooltip: {
      show: false,
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      position:'top',
      axisLine: {
        show: false
      },
      axisTick: {
        show: false
      },
      axisLabel: {
        margin: 20,
      },
      data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
    },
    yAxis: {
      type: 'value',
      interval: 1,
      axisLine: {
        show: false,
      },
      axisLabel: {
        show: false,
      },
      axisTick: {
        show: false,
      },
    },
    series: [{
      name: 'A',
      type: 'line',
      data: [10, 20, 30, 40, 50, 60, 70],
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
          // 0% 处的颜色   
          offset: 0, color: 'rgba(201,8,47,1)'
        },
        {
          // 100% 处的颜色
          offset: 1, color: 'rgba(230,19,92,0.65)'
        }], false)
      },  
      label: {
        show: true,
      },
    }]
  };
  chart.setOption(option);
  return chart;
}

@connect(({ counter, global }) => ({
  counter,
  global,
}), (dispatch) => ({

}))
class Index extends Component {
  config = {
    navigationBarTitleText: '首页',
    usingComponents: {
      'ec-canvas': '../../components/ec-canvas/ec-canvas', // 书写第三方组件的相对路径
      'nav-bar': '../../components/navigator-bar/navigator-bar' // 书写第三方组件的相对路径
    },
  }
  state={
    animation: null,
    weight: 120,
    height: 172,
    ec: {
      onInit: initChart,
    },
    navbarData: {
      backgroundColor: '#f5f5f5', //导航栏背景颜色
      backType: 'backhome', //返回按钮类型
      backImg: 'white', //返回按钮的颜色
      title: '首页',
    },
  }
  // componentWillReceiveProps (nextProps) {
  //   console.log(this.props, nextProps)
  // }
  BMIChangeLeft = (weight, height) => {
    // const { weight, height } = this.state;
    const BMI = ((weight * 1 + 30) / Math.pow(((height * 1 + 100) / 100), 2)).toFixed(1);
    if(BMI >= 34){
      return '100%'
    }else if(BMI >= 28){
      return `${75 + (6 - (34 - BMI))/6/4 * 100}%`
    }else if(BMI >= 24){
      return `${50 + (4 - (28 - BMI))/4/4 * 100}%`
    }else if(BMI >= 18){
      return `${25 + (6 - (24 - BMI))/6/4 * 100}%`
    }else {
      return `${(18 - BMI)/18/4 * 100}%`
    }
  }
  componentWillMount() {
    const animation = wx.createAnimation({
      duration: 1000,
      timingFunction: 'ease',
    })
    setTimeout(() => {
      console.log(this.BMIChangeLeft(this.state.weight, this.state.height))
      animation.left(this.BMIChangeLeft(this.state.weight, this.state.height)).step()
      this.setState({
        animation: animation.export(),
      })
    }, 300)
  }
  componentWillUnmount () { }

  componentDidShow () {
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: res => {
              this.props.dispatch({
                type: 'SAVEUSERINFO',
                payload: {
                  userInfo: res.userInfo,
                },
              })
            },
          })
        }
      }
    })
  }
  avatarTap = () => {
    console.log(111)
  }
  onGotUserInfo = (e) => {
    if(e.currentTarget.errMsg === "getUserInfo:ok"){
      this.props.dispatch({
        type: 'SAVEUSERINFO',
        payload: {
          userInfo: e.currentTarget.userInfo,
        },
      })
    }
  }
  componentDidHide () { }

  render () {
    const { global } = this.props
    const { userInfo } = global
    const { weight, height, navbarData } = this.state
    return (
      <View className='main'>
      <nav-bar 
        title={navbarData.title}
        background={navbarData.backgroundColor} 
        fixed
      >

      </nav-bar>
        <View className='main-header'>
          <View className='userInfo'>
            { userInfo ? (
                <Image src={userInfo.avatarUrl} class='userinfo-avatar' mode='cover' onClick={this.avatarTap} />
              ) : (
                <Button className='avatar-btn' openType='getUserInfo' lang='zh_CN' onGetUserInfo={this.onGotUserInfo} ></Button>
              )
            }
          </View>
          <View className='header-action'>
            <View>
              <Image 
                style={{width: '40rpx',height: '55rpx'}}
                src='https://mxchip-test.oss-cn-shanghai.aliyuncs.com/img_sources/menu-voice.png' 
                alt='voice'
                onClick={()=> wx.navigateTo({
                  url: '/pages/sound/index',
                })}
              />
            </View>
            <Text className='userInfo-nickname'>{userInfo.nickName}</Text>
            <View>
              <Image 
                style={{width: '54rpx',height: '56rpx'}}
                src='https://mxchip-test.oss-cn-shanghai.aliyuncs.com/img_sources/menu-question.png' 
                alt='question'
                onClick={()=> console.log('question')}
              />
            </View>
          </View>
        </View>
        <View className='main-content'>
          <View className='menu-list'>
            <View class='menu-item'>
              <Image 
                src='https://mxchip-test.oss-cn-shanghai.aliyuncs.com/img_sources/barrage.png' 
                alt='运动记录'
              />
              <Text>运动记录</Text>
            </View>
            <View class='menu-item'>
              <Image 
                src='https://mxchip-test.oss-cn-shanghai.aliyuncs.com/img_sources/update_virtualCoach.png' 
                alt='虚拟教练'
                onClick={() => wx.navigateTo({
                  url: '/pages/coach/index',
                })}
              />
              <Text>虚拟教练</Text>
            </View>
            <View class='menu-item'>
              <Image 
                src='https://mxchip-test.oss-cn-shanghai.aliyuncs.com/img_sources/update_exercise@2x.png' 
                alt='赛事活动'
              />
              <Text>赛事活动</Text>
            </View>
            <View class='menu-item'>
              <Image 
                src='https://mxchip-test.oss-cn-shanghai.aliyuncs.com/img_sources/barrage.png' 
                alt='设备登录'
              />
              <Text>设备登录</Text>
            </View>
          </View>
          <View className='my-body'>
            <Text className='body-title'>我的身材</Text>
            <View className='body-content'>
              <View className='pointer' animation={this.state.animation}>
                <Text>{((weight * 1 + 30) / Math.pow(((height * 1 + 100) / 100), 2)).toFixed(1)}</Text>
                <View className='triangle' />
              </View>
              <View className='body-wrap'>
                <View className='body-standard'>
                  偏瘦
                </View>
                <View className='body-standard'>
                  标准
                </View>
                <View className='body-standard'>
                  偏胖
                </View>
                <View className='body-standard'>
                  肥胖
                </View>
              </View>
            </View>
          </View>
          <View className='charts-wrap'>
            <View className='charts-header'>
              <Text>我的体重（kg）</Text> 
              <View className='right-wrap'>
                <Text>更新</Text>
                <Image 
                  className='enter-ico'
                  src='https://mxchip-test.oss-cn-shanghai.aliyuncs.com/img_sources/enter.png' 
                />
              </View>
            </View>
            <View className='charts'>
              <ec-canvas id='mychart-dom-area' canvas-id='mychart-area' ec={this.state.ec}></ec-canvas>
            </View>
          </View>
        </View>
      </View>
    )
  }
}

export default Index
