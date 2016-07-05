import { notify } from './misc'

export function myID(st) {
  return dispatch => st.system.status().then(status => {
    dispatch({
      type: 'MYID_SUCCESS',
      payload: status.myID,
    })
  }).catch(error => {
    dispatch({ type: 'CONNECTION_ERROR', error })
  })
}

export function connections(st){
  return dispatch => st.system.connections().then(({connections}) => {
    dispatch({ type: 'CONNECTIONS_SUCCESS', payload: connections})
  }).catch(error => {
    dispatch({ type: 'CONNECTION_ERROR', error })
  })
}

export function config(myID='', st){
  return dispatch => st.system.getConfig().then(({devices, folders, options}) => {
    dispatch({ type: 'FOLDERS_SUCCESS', payload: folders })
    dispatch({ type: 'DEVICES_SUCCESS', payload: devices.filter(({deviceID}) => deviceID != myID) })
    dispatch({ type: 'PREFERENCES_SUCCESS', payload: options })
  }).catch(error => {
    dispatch({ type: 'CONNECTION_ERROR', error })
  })
}

export function folderStatus(folders, st){
  return dispatch => folders.forEach(({id}) => {
    st.db.status(id).then(payload => {
      dispatch({ type: 'FOLDER_STATUS_SUCCESS', id, payload })
    }).catch(error => {
      dispatch({ type: 'CONNECTION_ERROR', error })
    })

  })
}
