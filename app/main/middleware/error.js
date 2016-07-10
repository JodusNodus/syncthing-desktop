import notify from '../utils/notify'

export default function error(store){
  let errSend = false
  return next => action => {
    const { power } = store.getState()
    if(action.type == 'CONNECTION_ERROR' && !errSend && power == 'awake'){
      notify('Connection Error', 'Could not connect to the Syncthing server.')
      errSend = true
    }else if(/.*\_SUCCESS/.test(action.type)){
      errSend = false
    }
    next(action)
  }
}
