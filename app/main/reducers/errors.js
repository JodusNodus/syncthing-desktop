export default function errors(state=[], {type, payload}) {
  switch (type) {
    case 'ERRORS_GET_SUCCESS':
    return payload.errors
    case 'ERRORS_CLEAR_SUCCESS':
    return []
    default:
    return state
  }
}
