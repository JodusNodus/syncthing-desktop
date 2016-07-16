import { showMessageBar, hideMessageBar } from '../actions/message-bar'

export default function messageBar(store){
  return next => action => {
    if(action.type == '@@router/LOCATION_CHANGE'){

      //Hide message bar
      store.dispatch(hideMessageBar())

    }else if(action.type == 'SERVICE_CONFIG_SET_SUCCESS'){

      store.dispatch(showMessageBar({
        msg: 'The config was saved succesfully, to take full effect Syncthing needs to restart.',
        ptStyle: 'positive',
        static: true,
      }))

    }
    next(action)
  }
}
