import { showMessageBar, hideMessageBar } from 'client/actions/message-bar'

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

    }else if(action.type == 'SERVICE_CONFIG_SET_FAILURE'){

      store.dispatch(showMessageBar({
        msg: 'The config could not be saved.',
        ptStyle: 'negative',
      }))

    }else if(action.type == 'CLIENT_CONFIG_SET_SUCCESS'){

      store.dispatch(showMessageBar({
        msg: 'The config was saved and loaded succesfully.',
        ptStyle: 'positive',
        static: true,
      }))

    }else if(action.type == 'CLIENT_CONFIG_SET_FAILURE'){

      store.dispatch(showMessageBar({
        msg: 'The config could not be saved.',
        ptStyle: 'negative',
      }))

    }else if(action.type == 'FOLDER_SCAN_SUCCESS'){

      store.dispatch(showMessageBar({
        msg: 'The folder will be immediatly rescanned.',
        ptStyle: 'primary',
      }))

    }
    next(action)
  }
}
