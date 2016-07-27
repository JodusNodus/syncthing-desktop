export const getSingleFolderStatus = id => dispatch =>
global.st.db.status(id).then(payload => {
  dispatch({
    type: 'FOLDER_STATUS_GET_SUCCESS',
    id,
    payload,
  })
}).catch(error => {
  dispatch({
    type: 'FOLDER_STATUS_GET_FAILURE',
    error,
  })
})

export const getFolderStatus = folders => dispatch =>
folders.forEach(({id}) => {
  getSingleFolderStatus(id)(dispatch)
})

export const getDeviceFolderCompletion = (devices, folder) => dispatch =>
devices.forEach(({deviceID}) => {
  global.st.db.completion(deviceID, folder).then(payload => {
    dispatch({
      type: 'DEVICE_FOLDER_COMPLETION_GET_SUCCESS',
      device: deviceID,
      folder,
      payload,
    })
  }).catch(error => {
    dispatch({
      type: 'DEVICE_FOLDER_COMPLETION_GET_FAILURE',
      error,
    })
  })
})

export const scanFolder = folder => dispatch =>
global.st.db.scan(folder).then(() => {
  dispatch({
    type: 'FOLDER_SCAN_SUCCESS',
  })
}).catch(error => {
  dispatch({
    type: 'FOLDER_SCAN_FAILURE',
    error,
  })
})

export const getIgnores = id => dispatch =>
global.st.db.getIgnores(id).then(payload => {
  dispatch({
    type: 'IGNORES_GET_SUCCESS',
    id,
    payload,
  })
}).catch(error => {
  dispatch({
    type: 'IGNORES_GET_FAILURE',
    error,
  })
})

export const setIgnores = (id, ignores) => dispatch =>
global.st.db.setIgnores(id, ignores).then(payload => {
  dispatch({
    type: 'IGNORES_SET_SUCCESS',
    id,
    payload,
  })
}).catch(error => {
  dispatch({
    type: 'IGNORES_SET_FAILURE',
    error,
  })
})

export const getMissing = (id, page=1, perpage=5) => dispatch =>
global.st.db.need(id, page, perpage).then(payload => {
  dispatch({
    type: 'MISSING_GET_SUCCESS',
    payload,
    id,
  })
}).catch(error => {
  dispatch({
    type: 'MiSSING_GET_FAILURE',
    error,
  })
})
