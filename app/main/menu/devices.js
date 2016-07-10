import { shell } from 'electron'

const device = ({ deviceID, name, online, address }) => ({
  label: `${name} ${online ? '('+address+')' : '(disconnected)'}`,
  id: deviceID,
  enabled: online ? true : false,
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
