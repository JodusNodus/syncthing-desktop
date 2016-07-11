export function getMyID() {
  return dispatch => global.st.system.status((error, payload) => {
    if(error){
      dispatch({ type: 'CONNECTION_ERROR', error })
    }else{
      dispatch({
        type: 'MYID_GET_SUCCESS',
        payload: payload.myID,
      })
      dispatch({ type: 'SYSTEM_STATUS_GET_SUCCESS', payload })
    }
  })
}

export function getConnections(){
  return dispatch => global.st.system.connections().then(({connections}) => {
    dispatch({ type: 'CONNECTIONS_GET_SUCCESS', payload: connections})
  }).catch(error => {
    dispatch({ type: 'CONNECTION_ERROR', error })
  })
}

export function getServiceConfig(myID){
  return dispatch => global.st.system.getConfig().then(({devices, folders, options, gui}) => {
    dispatch({ type: 'FOLDERS_GET_SUCCESS', payload: folders })
    dispatch({ type: 'DEVICES_GET_SUCCESS', payload: devices.filter(({deviceID}) => deviceID != myID) })
    dispatch({ type: 'GUI_PREFERENCES_GET_SUCCESS', payload: gui })
    dispatch({ type: 'PREFERENCES_GET_SUCCESS', payload: options })
  }).catch(error => {
    dispatch({ type: 'CONNECTION_ERROR', error })
  })
}

export function getVersion(){
  return dispatch => global.st.system.version((error, payload) => {
    if(error){
      dispatch({ type: 'CONNECTION_ERROR', error })
    }else{
      dispatch({ type: 'VERSION_GET_SUCCESS', payload })
    }
  })
}

export function setServiceConfig(key, value) {
  return dispatch => {
    const handleError = error => dispatch({
      type: 'SERVICE_CONFIG_SET_FAILED',
      payload: error,
    })

    global.st.system.getConfig((error, config) => {
      if(error){
        handleError(error)
      }else{
        global.st.system.setConfig({
          ...config,
          [key]: value,
        }, (error) => {
          if(error){
            handleError(error)
          }else{
            dispatch({
              type: 'SERVICE_CONFIG_SET_SUCCESS',
            })
          }
        })
      }

    })

  }
}

export function pauseDevice(device){
  return dispatch => global.st.system.pause(device).then(payload => {
    dispatch({ type: 'DEVICE_PAUSE_SUCCESS', payload, id: device })
  }).catch(error => {
    dispatch({ type: 'CONNECTION_ERROR', error })
  })
}

export function resumeDevice(device){
  return dispatch => global.st.system.resume(device).then(payload => {
    dispatch({ type: 'DEVICE_RESUME_SUCCESS', payload, id: device })
  }).catch(error => {
    dispatch({ type: 'CONNECTION_ERROR', error })
  })
}
