import _ from 'lodash'

const initialState = {
  msg: '',
  ptStyle: 'default',
  show: false,
  statics: [],
}

export default function messageBar(state=initialState, {type, payload}) {
  switch (type) {
    case 'MESSAGE_BAR_SHOW':
      if(payload.static){
      return {
        ...state,
        statics: _.uniqBy([
          ...state.statics,
          payload,
        ], x => JSON.stringify(x)),
      }
    }else {
      return {
        ...state,
        msg: payload.msg,
        ptStyle: payload.ptStyle,
        show: true,
      }
    }
    case 'MESSAGE_BAR_HIDE':
      return {
      ...state,
      show: false,
    }
    default:
      return state
  }
}
