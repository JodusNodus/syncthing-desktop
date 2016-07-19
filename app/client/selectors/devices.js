export const getDevice = ({devices}, id) => {
  const device = devices.devices.filter(x => x.deviceID == id)[0]
  return {
    ...device,
    ...devices.connections[id],
    ...devices.stats[id],
  }
}

export const getDevices = ({devices}) => devices.devices.map(device => ({
  ...device,
  ...devices.connections[device.deviceID],
  ...devices.stats[device.deviceID],
}))
