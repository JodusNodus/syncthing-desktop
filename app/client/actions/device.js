import { remote } from 'electron'

const st = remote.getGlobal('st')

export function pause(device){
  return dispatch => st.system.pause(device).then(payload => {
    dispatch({ type: 'DEVICE_PAUSE_SUCCESS', payload, id: device })
  }).catch(error => {
    dispatch({ type: 'CONNECTION_ERROR', error })
  })
}

export function resume(device){
  return dispatch => st.system.resume(device).then(payload => {
    dispatch({ type: 'DEVICE_RESUME_SUCCESS', payload, id: device })
  }).catch(error => {
    dispatch({ type: 'CONNECTION_ERROR', error })
  })
}
