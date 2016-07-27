export default function connections(state={}, {type, payload, id}) {
  switch (type) {
    case 'CONNECTIONS_GET_SUCCESS':
    return payload
    case 'DEVICE_PAUSE_SUCCESS':
    return {
      ...payload,
      [id]: {
        ...state[id],
        paused: true,
      },
    }
    case 'DEVICE_RESUME_SUCCESS':
    return {
      ...payload,
      [id]: {
        ...state[id],
        paused: false,
      },
    }
    default:
    return state
  }
}
