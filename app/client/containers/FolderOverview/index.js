import { PropTypes, Component } from 'react'
import h from 'react-hyperscript'
import { connect } from 'react-redux'
import { shell } from 'electron'

import Size from '../../components/Size'
import SharedDevices from '../../components/SharedDevices'
import { styles } from './styles.scss'
import Progress from 'react-progressbar'

class FolderOverview extends Component {
  render(){
    const { devices, initialValues, status } = this.props
    const folder = initialValues

    const sharedDevices = folder.devices.map(({deviceID}) => {
      return devices.filter(device => device.deviceID == deviceID)[0]
    }).filter(x => x)

    return h('div', {className: styles}, [
      h(Path, {path: folder.path, home: status.tilde}),
      folder.status && h(InSync, folder.status),
      h(SharedDevices, {devices: sharedDevices}),
    ])
  }
}

FolderOverview.propTypes = {
  params: PropTypes.object.isRequired,
  status: PropTypes.object.isRequired,
  devices: PropTypes.array.isRequired,
  initialValues: PropTypes.object.isRequired,
}

export default connect(
  state => ({
    status: state.systemStatus,
    devices: state.devices,
  })
)(FolderOverview)

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
      ]),
    ]),
    h('p.right'),
  ])
}
