import { PropTypes, Component } from 'react'
import h from 'react-hyperscript'
import { connect } from 'react-redux'
import { shell } from 'electron'

import Size from 'client/components/Size'
import SharedDevices from 'client/components/SharedDevices'
import Progress from 'react-progressbar'
import FromNow from 'client/components/FromNow'

import { getDeviceFolderCompletion } from 'main/actions/db'
import { getFolderStats } from 'main/actions/stats'
import { scanFolder } from 'main/actions/db'
import { getDevices } from 'main/reducers/devices'
import { getFolder } from 'main/reducers/folders'

import { styles } from './styles.scss'


const mapStateToProps = (state, {params}) => ({
  status: state.systemStatus,
  devices: getDevices(state),
  folder: getFolder(state, params.id),
})

@connect(
  mapStateToProps,
  {getDeviceFolderCompletion, getFolderStats, scanFolder},
)
export default class FolderOverview extends Component {
  static propTypes = {
    status: PropTypes.object.isRequired,
    devices: PropTypes.array.isRequired,
    folder: PropTypes.object.isRequired,
    getDeviceFolderCompletion: PropTypes.func.isRequired,
    getFolderStats: PropTypes.func.isRequired,
    scanFolder: PropTypes.func.isRequired,
  }

  componentDidMount(){
    this.newDevice.apply(this)
  }
  componentWillUpdate(newProps){
    const { folder } = this.props
    const isNewFolder = folder.id !== newProps.folder.id

    if(isNewFolder){
      this.newDevice.apply(this)
    }
  }
  newDevice(){
    const { folder, getDeviceFolderCompletion, getFolderStats } = this.props

    const sharedDevices = folder.devices

    getDeviceFolderCompletion(sharedDevices, folder.id)

    getFolderStats()
  }
  handleScan(){
    const { scanFolder, folder } = this.props
    scanFolder(folder.id)
  }
  render(){
    const { folder, devices, status } = this.props

    const sharedDevices = folder.devices.map(({deviceID, completion}) => {
      const device = devices.filter(device => device.deviceID == deviceID)[0]
      if(device){
        return {
          ...device,
          completion,
        }
      }
    }).filter(x => x)

    return h('div', {className: styles}, [
      h(Path, {path: folder.path, home: status.tilde}),
      folder.status && folder.status.state != 'error' && h(InSync, folder.status),
      folder.stats && h(LastScan, {state: folder.stats.state, handleScan: this.handleScan.bind(this)}),
      h(SharedDevices, {devices: sharedDevices}),
    ])
  }
}

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

const LastScan = ({lastScan, handleScan}) =>
h('div.section-item.last-scan', [
  h('p.left', 'Last Scan:'),
  h(FromNow, {className: 'center', value: lastScan}),
  h('a.right', {onClick: handleScan}, 'Force Scan'),
])
