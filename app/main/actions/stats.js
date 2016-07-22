export const getDeviceStats = () => dispatch =>
global.st.stats.devices().then(payload => {
  dispatch({ type: 'DEVICE_STATS_GET_SUCCESS', payload })
}).catch(error => {
  dispatch({ type: 'DEVICE_STATS_GET_FAILURE', error })
})

export const getFolderStats = () => dispatch =>
global.st.stats.folders().then(payload => {
  dispatch({ type: 'FOLDER_STATS_GET_SUCCESS', payload })
}).catch(error => {
  dispatch({ type: 'FOLDER_STATS_GET_FAILURE', error })
})
