export default function connectionsTotal(state = {}, {type, payload}) {
  switch (type) {
    case 'CONNECTIONS_TOTAL_GET_SUCCESS':
    return payload
    default:
    return state
  }
}
