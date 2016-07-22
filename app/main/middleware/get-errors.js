import { dialog } from 'electron'
import { win } from '../utils/app-window'

import { clearErrors } from '../actions/system'

const showErrorMsg = ({message}) =>
dialog.showMessageBox(win, {
  type: 'error',
  message: 'Syncthing Error',
  detail: message,
  buttons: ['OK'],
})

const getErrors = store => next => action => {
  if(action.type == 'ERRORS_GET_SUCCESS'){
    const errors = action.payload.errors
    errors.forEach(showErrorMsg)

    //All errors are seen by the user clear the errors.
    store.dispatch(clearErrors())
  }
  next(action)
}

export default getErrors
