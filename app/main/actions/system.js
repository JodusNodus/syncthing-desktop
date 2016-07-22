export const getMyID = () => dispatch =>
global.st.system.status((error, payload) => {
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

export const getConnections = () => dispatch =>
global.st.system.connections().then(({connections}) => {
  dispatch({ type: 'CONNECTIONS_GET_SUCCESS', payload: connections})
}).catch(error => {
  dispatch({ type: 'CONNECTIONS_GET_FAILURE', error })
})

export const getServiceConfig = myID => dispatch =>
global.st.system.getConfig().then(({devices, folders, options, gui}) => {
  dispatch({ type: 'FOLDERS_GET_SUCCESS', payload: folders })
  dispatch({ type: 'DEVICES_GET_SUCCESS', payload: devices.filter(({deviceID}) => deviceID != myID) })
  dispatch({ type: 'GUI_PREFERENCES_GET_SUCCESS', payload: gui })
  dispatch({ type: 'PREFERENCES_GET_SUCCESS', payload: options })
}).catch(error => {
  dispatch({ type: 'SERVICE_CONFIG_GET_FAILURE', error })
})

export const getVersion = () => dispatch =>
global.st.system.version((error, payload) => {
  if(!error){
    dispatch({ type: 'VERSION_GET_SUCCESS', payload })
  }else{
    dispatch({ type: 'VERSION_GET_FAILURE', error })
  }
})

export const setServiceConfig = (key, value) => dispatch => {
  const handleError = error => dispatch({
    type: 'SERVICE_CONFIG_SET_FAILURE',
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

export const pauseDevice = device => dispatch =>
global.st.system.pause(device).then(payload => {
  dispatch({ type: 'DEVICE_PAUSE_SUCCESS', payload, id: device })
}).catch(error => {
  dispatch({ type: 'DEVICE_PAUSE_FAILURE', error })
})

export const resumeDevice = device => dispatch =>
global.st.system.resume(device).then(payload => {
  dispatch({ type: 'DEVICE_RESUME_SUCCESS', payload, id: device })
}).catch(error => {
  dispatch({ type: 'DEVICE_RESUME_FAILURE', error })
})

export const getErrors = () => dispatch =>
global.st.system.errors().then(payload => {
  dispatch({
    type: 'ERRORS_GET_SUCCESS',
    payload,
  })
}).catch(error => {
  dispatch({
    type: 'ERRORS_GET_FAILURE',
    error,
  })
})

export const clearErrors = () => dispatch =>
global.st.system.clearErrors().then(() => {
  dispatch({
    type: 'ERRORS_CLEAR_SUCCESS',
  })
}).catch(error => {
  dispatch({
    type: 'ERRORS_CLEAR_FAILURE',
    error,
  })
})
