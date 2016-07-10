export function deviceStats(){
  return dispatch => global.st.stats.devices().then(payload => {
    dispatch({ type: 'DEVICE_STATS_SUCCESS', payload })
  }).catch(error => {
    dispatch({ type: 'CONNECTION_ERROR', error })
  })
}
