export const getFolder = ({folders}, id) => {
  const folder = folders.folders.filter(x => x.id == id)[0]
  const completion = folders.completion[id]
  return {
    ...folder,
    ...folders.status[id],
    devices: folder.devices.map(({deviceID}) => ({
      deviceID,
      completion: completion && completion[deviceID],
    })),
  }
}

export const getFolders = ({folders}) => folders.folders.map(folder => ({
  ...folder,
  ...folders.status[folder.id],
  ...folders.completion[folder.id],
}))
