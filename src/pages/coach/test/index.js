import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image,Button, Radio, RadioGroup } from '@tarojs/components'
import { connect } from '@tarojs/redux'

import './index.scss'

@connect(({ record }) => ({
  record,
}))
class TestPage extends Component {
  config = {
    usingComponents: {
      'nav-bar': '../../../components/navigator-bar/navigator-bar' // 书写第三方组件的相对路径
    },
  }
  state = {
    navbarData: {
      backgroundColor: '#fff', //导航栏背景颜色
      backType: 'backhome', //返回按钮类型
      backImg: 'white', //返回按钮的颜色
      title: '运动能力测试',
    },
    list: [
      {
        index: 1,
        question: '1. 坐位体前屈伸展：双手能触碰到的位置？',
        answer: [
          { name: '只能摸到膝盖', value: 'a'},
          { name: '摸不到脚踝', value: 'b'},
          { name: '可摸到脚踝', value: 'c'},
          { name: '指尖可触地', value: 'd'},
          { name: '双拳可触地', value: 'e'},
        ],
      },
      {
        index: 2,
        question: '2. 坐位体前屈伸展：双手能触碰到的位置？',
        answer: [
          { name: '只能摸到膝盖', value: 'a'},
          { name: '摸不到脚踝', value: 'b'},
          { name: '可摸到脚踝', value: 'c'},
          { name: '指尖可触地', value: 'd'},
          { name: '双拳可触地', value: 'e'},
        ],
      },
      {
        index: 3,
        question: '3. 坐位体前屈伸展：双手能触碰到的位置？',
        answer: [
          { name: '只能摸到膝盖', value: 'a'},
          { name: '摸不到脚踝', value: 'b'},
          { name: '可摸到脚踝', value: 'c'},
          { name: '指尖可触地', value: 'd'},
          { name: '双拳可触地', value: 'e'},
        ],
      },
      {
        index: 4,
        question: '4. 坐位体前屈伸展：双手能触碰到的位置？',
        answer: [
          { name: '只能摸到膝盖', value: 'a'},
          { name: '摸不到脚踝', value: 'b'},
          { name: '可摸到脚踝', value: 'c'},
          { name: '指尖可触地', value: 'd'},
          { name: '双拳可触地', value: 'e'},
        ],
      },
    ],
    selected: '',
  }
  componentWillMount() {
    console.log(this.$router.params.index)
  }
  handleBtn = () => {
    
  }
  handleChange = (e) => {
    console.log(e)
    this.setState({
      selected: e.detail.value,
    })
  }
  testTap = () => {
    console.log(22)
  }
  componentWillUnmount () {
    
  }
  componentDidHide () { }
  render () {
    const { navbarData } = this.state;
    const current = this.state.list.filter(item => item.index == this.$router.params.test)[0] || {index: 0};
    return (
      <View className='test-container'>
        <nav-bar 
          title={navbarData.title}
          background={navbarData.backgroundColor} 
          back
          fixed
          redirectUrl='test'
          onTap={this.testTap}
        />
        { this.$router.params.test ? (
          <View className='test-item'>
            <Text className='question'>
              {current.question}
            </Text>
            <View className='answer-list'>
              <RadioGroup onChange={this.handleChange}>
                {current && current.answer.map((item) => {
                  return (
                    <Label className='answer-label' for={item.value} key={item.value}>
                      <Radio className='answer-radio' value={item.value} checked={item.checked}>
                        {item.name}
                      </Radio>
                    </Label>
                  )
                })}
              </RadioGroup>
            </View>
          </View>
        ) : (
          <View className='no-test'>
          请认真测试，教练乔会根据您的身体状况向您推荐最贴心的个性化训练计划  
          </View>
        )}
        <View className='btn-wrap'>
          <navigator
            url={`index?test=${current.index+1}`}
            open-type='redirect'
            hover-class='other-navigator-hover'
          >
            <Button 
              className='add-btn'
              onClick={this.handleBtn}
            >
              下一步
            </Button>
          </navigator>
        </View>
      </View>
    )
  }
}

export default TestPage
