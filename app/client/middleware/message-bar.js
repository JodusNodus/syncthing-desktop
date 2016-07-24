import { showMessageBar, hideMessageBar } from 'client/actions/message-bar'

export default function messageBar(store){
  return next => action => {

    if(action.type == 'MESSAGE_BAR_SHOW' && action.payload.timeout){

      //Hide msg after specifief time
      const { name, ptStyle, timeout } = action.payload
      setTimeout(() => {
        const currentMsg = store.getState().messageBar
        //Check if the message is still current
        if(currentMsg.name == name && currentMsg.ptStyle == ptStyle){
          store.dispatch(hideMessageBar())
        }
      }, timeout)

    }

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
        timeout: 5000,
      }))

    }else if(action.type == 'CLIENT_CONFIG_SET_FAILURE'){

      store.dispatch(showMessageBar({
        msg: 'The config could not be saved.',
        ptStyle: 'negative',
        timeout: 5000,
      }))

    }else if(action.type == 'FOLDER_SCAN_SUCCESS'){

      store.dispatch(showMessageBar({
        msg: 'The folder was succesfully rescanned.',
        ptStyle: 'primary',
        timeout: 3000,
      }))

    }else if(action.type == 'IGNORES_SET_SUCCESS'){

      store.dispatch(showMessageBar({
        msg: 'The ignore patterns have been saved succesfully.',
        ptStyle: 'positive',
        timeout: 5000,
      }))

    }else if(action.type == 'IGNORES_SET_FAILURE'){

      store.dispatch(showMessageBar({
        msg: 'The ignore patterns could not be saved.',
        ptStyle: 'negative',
        timeout: 5000,
      }))

    }
    next(action)
  }
}
