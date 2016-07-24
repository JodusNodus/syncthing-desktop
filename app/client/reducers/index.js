import { combineReducers } from 'redux'
import { routerReducer as routing } from 'react-router-redux'
import { reducers } from 'main/reducers/index'
import { reducer as form } from 'redux-form'
import qrCodeModal from './qr-code-modal'
import qrCodeScanModal from './qr-code-scan-modal'
import messageBar from './message-bar'
import automaticSetup from './automatic-setup'

const rootReducer = combineReducers({
  ...reducers,
  routing,
  form,
  qrCodeModal,
  qrCodeScanModal,
  messageBar,
  automaticSetup,
})

export default rootReducer
