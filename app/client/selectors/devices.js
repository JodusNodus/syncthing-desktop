export const getDevice = ({devices}, id) => devices
.filter(x => x.deviceID == id)[0]
