export const getFolderStatus = folders => dispatch =>
folders.forEach(({id}) => {
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
