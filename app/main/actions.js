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

export function deviceStats(st){
  return dispatch => st.stats.devices().then(payload => {
    dispatch({ type: 'DEVICE_STATS_SUCCESS', payload })
  }).catch(error => {
    dispatch({ type: 'CONNECTION_ERROR', error })
  })
}

export function systemStatus(st){
  return dispatch => st.system.status().then(payload => {
    dispatch({ type: 'SYSTEM_STATUS_SUCCESS', payload })
  }).catch(error => {
    dispatch({ type: 'CONNECTION_ERROR', error })
  })
}

export function pauseDevice(device, st){
  return dispatch => st.system.pause(device).then(payload => {
    dispatch({ type: 'DEVICE_PAUSE_SUCCESS', payload })
  }).catch(error => {
    dispatch({ type: 'CONNECTION_ERROR', error })
  })
}

export function resumeDevice(device, st){
  return dispatch => st.system.resume(device).then(payload => {
    dispatch({ type: 'DEVICE_RESUME_SUCCESS', payload })
  }).catch(error => {
    dispatch({ type: 'CONNECTION_ERROR', error })
  })
}
