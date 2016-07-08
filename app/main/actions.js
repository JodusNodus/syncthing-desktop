export function myID(st) {
  return dispatch => st.system.status((error, payload) => {
    if(error){
      dispatch({ type: 'CONNECTION_ERROR', error })
    }else{
      dispatch({
        type: 'MYID_SUCCESS',
        payload: payload.myID,
      })
      dispatch({ type: 'SYSTEM_STATUS_SUCCESS', payload })
    }
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
  return dispatch => st.system.getConfig().then(({devices, folders, options, gui}) => {
    dispatch({ type: 'FOLDERS_SUCCESS', payload: folders })
    dispatch({ type: 'DEVICES_SUCCESS', payload: devices.filter(({deviceID}) => deviceID != myID) })
    dispatch({ type: 'PREFERENCES_GUI_SUCCESS', payload: gui })
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

export function version(st){
  return dispatch => st.system.version((error, payload) => {
    if(error){
      dispatch({ type: 'CONNECTION_ERROR', error })
    }else{
      dispatch({ type: 'VERSION_SUCCESS', payload })
    }
  })
}
