import { remote } from 'electron'

let AutoLaunch
if(remote){
  AutoLaunch = remote.require('auto-launch')
}else{
  AutoLaunch = require('auto-launch')
}

const appLauncher = new AutoLaunch({
  name: 'Syncthing Desktop',
  isHidden: true,
})

export const getAutoLaunch = () => dispatch =>
appLauncher.isEnabled().then(payload => {
  dispatch({
    type: 'AUTO_LAUNCH_GET_SUCCESS',
    payload, //enabled bool
  })
}).catch(error => {
  dispatch({
    type: 'AUTO_LAUNCH_GET_FAILURE',
    error,
  })
})

export const setAutoLaunch = enable => dispatch => {
  appLauncher.isEnabled()
  .then(currentlyEnabled => {
    if(enable && !currentlyEnabled){
      return appLauncher.enable()
    }else if(currentlyEnabled){
      return appLauncher.disable()
    }
  })
  .then(() => dispatch({
    type: 'AUTO_LAUNCH_SET_SUCCESS',
    payload: enable,
  }))
  .catch(error => dispatch({
    type: 'AUTO_LAUNCH_SET_FAILURE',
    error,
  }))
}
