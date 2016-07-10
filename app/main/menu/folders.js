import { shell } from 'electron'
import { formatBytes } from '../utils/misc'

const folder = ({ label, id, status, path }) => ({
  label: `${label || id} ${status ? '(' + formatBytes(status.inSyncBytes) + '/' + formatBytes(status.globalBytes) + ') ('+ status.state +')': ''}`,
  id,
  path, 
  click: ({path}) => shell.showItemInFolder(path),
})

export default function folders(folders) {
  if(folders.length > 0){
    return [
      { label: 'Folders', enabled: false  },
      ...folders.map(folder),
    ]
  }else{
    return [
      { label: 'No folders found', enabled: false },
    ]
  }
}

export default folders
