import { shell } from 'electron'

const device = ({ deviceID, name, connected, address }) => ({
  label: `${name} ${connected ? '('+address+')' : '(disconnected)'}`,
  id: deviceID,
  enabled: connected ? true : false,
  address,
  click: ({address}) => shell.openExternal('http://'+address),
})

export default function devices(devices) {
  if(devices.length > 0){
    return [
      { label: 'Devices', enabled: false },
      ...devices.map(device),
    ]
  }else{
    return [
      { label: 'No devices found', enabled: false },
    ]
  }
}

export default devices
