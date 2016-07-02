import {notify} from './misc'

let connectionError = function (){
  notify('Connection Error', 'Could not connect to the Syncthing server.')
}

export function errorMiddleware(store){
  let errSend = false
  return next => action => {
    const {power} = store.getState()
    if(action.type == 'CONNECTION_ERROR' && !errSend){
      connectionError()
      errSend = true
    }else if(/.*\_SUCCESS/.test(action.type)){
      errSend = false
    }
    next(action)
  }
}
