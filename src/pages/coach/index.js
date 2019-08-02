import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
// import { connect } from '@tarojs/redux'

import './index.scss'

// @connect(({ record }) => ({
//   record,
// }))
class CoachPage extends Component {
  config = {
    navigationBarTitleText: '教练乔',
    usingComponents: {
      'nav-bar': '../../components/navigator-bar/navigator-bar' // 书写第三方组件的相对路径
    },
  }
  state={
    navbarData: {
      backgroundColor: '#f5f5f5', //导航栏背景颜色
      backType: 'backhome', //返回按钮类型
      backImg: 'white', //返回按钮的颜色
      title: '教练乔',
    },
  }
  componentWillMount() {
  }
  componentWillUnmount () {
    
  }
  componentDidHide () { }
  render () {
    const { navbarData } = this.state;
    return (
      <View className='coach-container'>
        <nav-bar 
          title={navbarData.title}
          background={navbarData.backgroundColor} 
          back
          fixed
        >
        </nav-bar>
        <View className='coach-plan'>
          <Text className='title'>
            个性化训练计划
          </Text>
          <View className='plan-list'>
            <View className='plan-item'>
              <View 
                className='item-left' 
              >
                <Text>暂无训练</Text>
                <Text>
                  请前往测试，可获得训练
                </Text>
              </View>
              <Image 
                className='item-right'
                onClick={() => wx.navigateTo({
                  url: '/pages/coach/test/index',
                })}
                src='https://mxchip-test.oss-cn-shanghai.aliyuncs.com/img_sources/enter.png' 
              />
            </View>
          </View>
        </View>
        <View className='coach-custom'>
          <Text className='title'>
            我的自定义
          </Text>
          <View className='custom-grid'>
            <View className='custom-item'>
              <View className='custom-wrap'>
                <Image style={{ height: '72rpx', width: '72rpx'}} src='https://mxchip-test.oss-cn-shanghai.aliyuncs.com/img_sources/time_small@2x.png' />
                <Text>心率控制</Text>
              </View>
            </View>
            <View className='custom-item'>
              <View className='custom-wrap'>
                <Image style={{height: '48rpx', width: '96rpx'}} src='https://mxchip-test.oss-cn-shanghai.aliyuncs.com/img_sources/step@2x.png' />
                <Text>论持久战</Text>
              </View>
            </View>
            <View className='custom-item'>
              <View className='custom-wrap'>
                <Image src='https://mxchip-test.oss-cn-shanghai.aliyuncs.com/img_sources/distance_small@2x.png' />
                <Text>最远的距离</Text>
              </View>
            </View>
            <View className='custom-item'>
              <View className='custom-wrap'>
                <Image style={{width: '54rpx', height: '73rpx'}} src='https://mxchip-test.oss-cn-shanghai.aliyuncs.com/img_sources/calorie_small@2x.png' />
                <Text>燃烧吧，卡路里</Text>
              </View>
            </View>
          </View>
        </View>
        <View className='heart-device'>
          <Text className='title'>
            添加心率设备
          </Text>
          <View className='search-device'>
            <Text>搜索绑定附近的心率设备</Text>
            <Image style={{ height: '50rpx', width: '50rpx'}} src='https://mxchip-test.oss-cn-shanghai.aliyuncs.com/img_sources/time_small@2x.png' />
          </View>
        </View>
      </View>
    )
  }
}

export default CoachPage
