import { combineReducers } from 'redux'
import { routerReducer as routing } from 'react-router-redux'
import { reducers } from '../../main/reducers/index'
import { reducer as form } from 'redux-form'

const rootReducer = combineReducers({
  ...reducers,
  routing,
  form,
})

export default rootReducer
