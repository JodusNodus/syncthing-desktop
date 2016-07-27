const initialState = {
  show: false,
}

export default function missingModal(state=initialState, {type}) {
  switch (type) {
    case 'MISSING_MODAL_SHOW':
    return {
      show: true,
    }
    case 'MISSING_MODAL_HIDE':
    return {
      show: false,
    }
    default:
    return state
  }
}
