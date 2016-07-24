const initialState = {
  config: {},
  isSuccess: false,
  isFailure: false,
  isFetching: false,
  useManual: false,
}

export default function automaticSetup(state = initialState, {type, payload}) {
  switch (type) {
    case 'AUTOMATIC_SETUP_BEGIN':
    return {
      ...initialState,
      isFetching: true,
    }
    case 'AUTOMATIC_SETUP_SUCCESS':
    return {
      config: payload,
      isSuccess: true,
      isFailure: false,
      isFetching: false,
    }
    case 'AUTOMATIC_SETUP_FAILURE':
    return {
      ...initialState,
      isFailure: true,
    }
    case 'MANUAL_SETUP_USE':
    return {
      ...initialState,
      useManual: true,
    }
    default:
    return state
  }
}
