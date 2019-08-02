const INITIAL_STATE = {
  recordList: [
    {
      id: 1,
      openSound: true,
      checked: true,
      day: '2019.04.19',
      musicLength: 20,
      play: true,
    }, {
      id: 2,
      openSound: false,
      checked: true,
      day: '2019.04.20',
      musicLength: 30,
      play: false,
      playTime: 0,
      src: 'http://ws.stream.qqmusic.qq.com/M500001VfvsJ21xFqb.mp3?guid=ffffffff82def4af4b12b3cd9337d5e7&uin=346897220&vkey=6292F51E1E384E06DCBDC9AB7C49FD713D632D313AC4858BACB8DDD29067D3C601481D36E62053BF8DFEAF74C0A5CCFADD6471160CAF3E6A&fromtag=46',
    }, {
      id: 3,
      openSound: false,
      checked: false,
      day: '2019.04.21',
      musicLength: 30,
      play: false,
      playTime: 0,
      src: 'http://ws.stream.qqmusic.qq.com/M500001VfvsJ21xFqb.mp3?guid=ffffffff82def4af4b12b3cd9337d5e7&uin=346897220&vkey=6292F51E1E384E06DCBDC9AB7C49FD713D632D313AC4858BACB8DDD29067D3C601481D36E62053BF8DFEAF74C0A5CCFADD6471160CAF3E6A&fromtag=46',
    },
    {
      id: 4,
      openSound: false,
      checked: false,
      day: '2019.04.21',
      musicLength: 30,
      play: false,
      playTime: 0,
      src: 'http://ws.stream.qqmusic.qq.com/M500001VfvsJ21xFqb.mp3?guid=ffffffff82def4af4b12b3cd9337d5e7&uin=346897220&vkey=6292F51E1E384E06DCBDC9AB7C49FD713D632D313AC4858BACB8DDD29067D3C601481D36E62053BF8DFEAF74C0A5CCFADD6471160CAF3E6A&fromtag=46',
    },
  ],
}

export default function record (state = INITIAL_STATE, action) {
  switch (action.type) {
    case 'SAVERECORD':
      return {
        ...state,
        ...action.payload,
      }  
    case 'ADDRECORD':
      return {
        ...state,
        recordList: [
          ...state.recordList, 
          {
            id: state.recordList[state.recordList.length - 1].id + 1, 
            ...action.payload,
          },
        ],
      }  
    case 'CHANGERECORDSTATUS':
      return {
        ...state,
        ...state.recordList.map(item => item.play = item.id === action.payload ? !item.play : item.play),
      }  
    case 'REMOVERECORD':
      return {
        ...state,
        recordList: state.recordList.filter(item => item.id !== action.payload),
      }  
    default:
      return state
  }
}
