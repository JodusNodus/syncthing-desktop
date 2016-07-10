const initialState = {
  isFailed: false,
  isSuccess: false,
  config: {},
}
export default function config(state = initialState, {type, payload}) {
  switch (type){
    case 'CONFIG_GET_SUCCESS':
      return {
      isFailed: false,
      isSuccess: true,
      config: payload,
    }
    case 'CONFIG_GET_FAILED':
      return {
      isFailed: true,
      isSuccess: false,
      config: payload,
    }
    case 'CONFIG_SET_SUCCESS':
      return {
      isFailed: false,
      isSuccess: true,
      config: payload,
    }
    default:
      return state
  }
}
