import { combineReducers } from 'redux'
import counter from './counter'
import global from './global'
import record from './record'

export default combineReducers({
  counter,
  global,
  record,
})
