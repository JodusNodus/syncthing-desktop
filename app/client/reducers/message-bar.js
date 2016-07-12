const initialState = {
  msg: '',
  ptStyle: 'default',
  show: false,
}

export default function messageBar(state=initialState, {type, payload}) {
  switch (type) {
    case 'MESSAGE_BAR_SHOW':
      return {
      msg: payload.msg,
      ptStyle: payload.ptStyle,
      show: true,
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
