export default function devices(state = [], {type, payload, id}) {
  switch (type){
    case 'DEVICES_GET_SUCCESS':
      return payload
    case 'CONNECTIONS_GET_SUCCESS':
      return state.map(device => {
      const connection = payload[device.deviceID]
      return {
        ...device,
        online: connection && connection.connected,
        address: connection ? connection.address : false,
        paused: connection && connection.paused,
      }
    })
    case 'DEVICE_STATS_GET_SUCCESS':
      return state.map(device => {
      const stats = payload[device.deviceID]
      return {
        ...device,
        ...stats,
      }
    })
    case 'DEVICE_PAUSE_SUCCESS':
      return state.map(device => {
      return {
        ...device,
        paused: device.deviceID == id ? true : device.paused,
      }
    })
    case 'DEVICE_RESUME_SUCCESS':
      return state.map(device => {
      return {
        ...device,
        paused: device.deviceID == id ? false : device.paused,
      }
    })
    default:
      return state
  }
}

export const getDevice = ({devices}, id) => devices
.filter(x => x.deviceID == id)[0]
