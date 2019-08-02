/**
 * by simbalion 
 * 2019-4-10
 */

//global

const INITIAL_STATE = {
  userInfo: null,
}

export default function global (state = INITIAL_STATE, action) {
  switch (action.type) {
    case 'SAVEUSERINFO':
      return {
        ...state,
        ...action.payload,
      }  
    default:
      return state
  }
}
