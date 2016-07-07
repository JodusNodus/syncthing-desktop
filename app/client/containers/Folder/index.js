import React, { PropTypes, Component } from 'react'
import h from 'react-hyperscript'
import { connect } from 'react-redux'
import { shell } from 'electron'

import Size from '../../components/Size'
import SharedDevices from '../../components/SharedDevices'
import { styles } from './styles.scss'
import Progress from 'react-progressbar'

class Folder extends Component {
  render(){
    const { folders, params, status, devices } = this.props
    const folder = folders.filter(x => x.id == params.id)[0]

    const sharedDevices = folder.devices.map(({deviceID}) => {
      return devices.filter(device => device.deviceID == deviceID)[0]
    }).filter(x => x)

    if(folder){
      return h('div.padded-more', {className: styles}, [
        h('header.page-header', [
          h('h2', folder.label || folder.id),
          folder.status && h(HeaderStateIcon, {state: folder.status.state}),
        ]),
        h('hr'),
        h(Path, {path: folder.path, home: status.tilde}),
        folder.status && h(InSync, folder.status),
        h(SharedDevices, {devices: sharedDevices}),
      ])
    }else{
      return h('div', [
        h('h1', 'Folder not available'),
      ])
    }
  }
}

Folder.propTypes = {
  params: PropTypes.object.isRequired,
  folders: PropTypes.array.isRequired,
  status: PropTypes.object.isRequired,
  devices: PropTypes.array.isRequired,
}

export default connect(
  state => ({
    folders: state.folders,
    status: state.systemStatus,
    devices: state.devices,
  })
)(Folder)

const HeaderStateIcon = ({state}) => h('h3.text-muted', state)

const Path = ({path, home}) => h('div.section-item', [
  h('p.left', 'Path:'),
  h('p.center', path.replace(home, '~')),
  h('a.right', {
    onClick: () => shell.showItemInFolder(path),
  }, 'Open'),
])

const InSync = ({globalBytes, inSyncBytes}) => {
  const percent = Math.round((globalBytes / inSyncBytes) * 100)
  return h('div.section-item.in-sync', [
    h('p.left', 'Local In Sync:'),
    h('div.center', [
      h(Progress, {completed: percent}),
      h('div.details', [
        h(Size, {value: inSyncBytes}),
        `${percent}%`,
        h(Size, {value: globalBytes}),
      ])
    ]),
    h('p.right'),
  ])
}
