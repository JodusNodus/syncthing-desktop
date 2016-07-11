import { combineReducers } from 'redux'
import { routerReducer as routing } from 'react-router-redux'
import { reducers } from '../../main/reducers/index'
import { reducer as form } from 'redux-form'
import qrCodeModal from './qr-code-modal'

const rootReducer = combineReducers({
  ...reducers,
  routing,
  form,
  qrCodeModal,
})

export default rootReducer
