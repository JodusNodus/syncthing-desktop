import storage from 'electron-json-storage'

export function get() {
  return dispatch =>
  storage.get('config', (error, config) => {
    if(!error && config.apiKey){
      dispatch({
        type: 'CONFIG_GET_SUCCESS',
        payload: config,
      })
    }else{
      dispatch({
        type: 'CONFIG_GET_FAILED',
        error,
      })
    }
  })
}

export function set(config) {
  return dispatch => 
  storage.set('config', config, error => {
    if(!error){
      dispatch({
        type: 'CONFIG_SET_SUCCESS',
        payload: config,
      })
    }else{
      dispatch({
        type: 'CONFIG_SET_FAILED',
        error,
      })
    }
  })
}
