export default function stats(state={}, {type, payload}) {
  switch (type) {
    case 'DEVICE_STATS_GET_SUCCESS':
    return payload
    default:
    return state
  }
}
