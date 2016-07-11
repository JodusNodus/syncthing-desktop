import storage from 'electron-json-storage'

export function getClientConfig() {
  return dispatch =>
  storage.get('config', (error, config) => {
    if(!error && config.apiKey){
      dispatch({
        type: 'CLIENT_CONFIG_GET_SUCCESS',
        payload: config,
      })
    }else{
      dispatch({
        type: 'CLIENT_CONFIG_GET_FAILED',
        error,
      })
    }
  })
}

export function setClientConfig(config) {
  return dispatch => 
  storage.set('config', config, error => {
    if(!error){
      dispatch({
        type: 'CLIENT_CONFIG_SET_SUCCESS',
        payload: config,
      })
    }else{
      dispatch({
        type: 'CLIENT_CONFIG_SET_FAILED',
        error,
      })
    }
  })
}
