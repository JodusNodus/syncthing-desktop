import { hideMessageBar } from '../actions/message-bar'

export default function routing(store){
  return next => action => {
    if(action.type == '@@router/LOCATION_CHANGE'){
      //Hide message bar
      store.dispatch(hideMessageBar())
    }
    next(action)
  }
}
