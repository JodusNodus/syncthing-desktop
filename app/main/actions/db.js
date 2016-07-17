export function getFolderStatus(folders){
  return dispatch => folders.forEach(({id}) => {
    global.st.db.status(id).then(payload => {
      dispatch({
        type: 'FOLDER_STATUS_GET_SUCCESS',
        id,
        payload,
      })
    }).catch(error => {
      dispatch({
        type: 'CONNECTION_ERROR',
        error,
      })
    })
  })
}

export function getDeviceFolderCompletion(devices, folder){
  return dispatch => devices.forEach(({deviceID}) => {
    global.st.db.completion(deviceID, folder).then(payload => {
      dispatch({
        type: 'DEVICE_FOLDER_COMPLETION_GET_SUCCESS',
        device: deviceID,
        folder,
        payload,
      })
    }).catch(error => {
      dispatch({
        type: 'CONNECTION_ERROR',
        error,
      })
    })
  })
}
