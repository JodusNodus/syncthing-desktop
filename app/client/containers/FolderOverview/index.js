import { PropTypes, Component } from 'react'
import h from 'react-hyperscript'
import { connect } from 'react-redux'
import { shell } from 'electron'

import Size from 'client/components/Size'
import SharedDevices from 'client/components/SharedDevices'
import Progress from 'react-progressbar'
import FromNow from 'client/components/FromNow'
import MissingModal from 'client/components/MissingModal'

import { getDeviceFolderCompletion } from 'main/actions/db'
import { getFolderStats } from 'main/actions/stats'
import { scanFolder } from 'main/actions/db'
import { showMessageBar } from 'client/actions/message-bar'
import { getFolderWithMissing } from 'main/reducers/folders'
import { showMissingModal } from 'client/actions/missing-modal'

import { styles } from './styles.scss'

const mapStateToProps = (state, {params}) => ({
  status: state.systemStatus,
  folder: getFolderWithMissing(state, params.id),
})

@connect(
  mapStateToProps,
  {
    getDeviceFolderCompletion,
    getFolderStats,
    scanFolder,
    showMessageBar,
    showMissingModal,
  },
)
export default class FolderOverview extends Component {
  static propTypes = {
    status: PropTypes.object.isRequired,
    folder: PropTypes.object.isRequired,
    getDeviceFolderCompletion: PropTypes.func.isRequired,
    getFolderStats: PropTypes.func.isRequired,
    scanFolder: PropTypes.func.isRequired,
    showMessageBar: PropTypes.func.isRequired,
    showMissingModal: PropTypes.func.isRequired,
  }

  constructor(props){
    super(props)
    this.newDevice = this.newDevice.bind(this)
    this.handleScan = this.handleScan.bind(this)
    this.showMissingModal = this.showMissingModal.bind(this)
  }
  componentDidMount(){
    this.newDevice()
  }
  componentWillUpdate(newProps){
    const { folder, showMessageBar } = newProps

    if(this.props.folder.id !== folder.id){
      this.newDevice(newProps)
    }

    if(this.props.folder.status.needBytes > 0 && folder.status.needBytes < 1){
      showMessageBar({
        msg: 'Folder has completed syncing.',
        ptStyle: 'positive',
        timeout: 10000,
      })
    }

  }
  newDevice(props=this.props){
    const {
      folder,
      getDeviceFolderCompletion,
      getFolderStats,
      showMessageBar,
    } = props

    const sharedDevices = folder.devices

    getDeviceFolderCompletion(sharedDevices, folder.id)

    //Get stats for last scan field
    getFolderStats()

    //No Shared Devices
    if(folder.status && folder.status.state == 'unshared'){
      showMessageBar({
        msg: 'You have not shared this folder with any device.',
        ptStyle: 'warning',
      })
    }
  }
  handleScan(){
    const { scanFolder, folder } = this.props
    scanFolder(folder.id)
  }
  showMissingModal(){
    const { showMissingModal } = this.props
    showMissingModal()
  }
  render(){
    const {
      folder,
      status,
    } = this.props

    //Filter out this device
    const sharedDevices = folder.devices.filter(x => x.name)

    return h('div', {className: styles}, [
      h(MissingModal, {folder}),
      h(Path, {path: folder.path, home: status.tilde}),
      folder.status && folder.status.state != 'error' && h(InSync, {...folder.status, handleMissingFiles: this.showMissingModal}),
      folder.stats && h(LastScan, {state: folder.stats.state, handleScan: this.handleScan}),
      folder.status && folder.status.state != 'unshared' && h(SharedDevices, {devices: sharedDevices}),
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

const InSync = ({globalBytes, inSyncBytes, needBytes, handleMissingFiles}) => {
  const percent = Math.round((inSyncBytes / globalBytes) * 100)
  return h('div.section-item.in-sync', [
    h('p.left', 'Local In Sync:'),
    h('div.center', [
      h(Progress, {completed: 30}),
      h('div.details', [
        h(Size, {value: inSyncBytes}),
        `${percent}%`,
        h(Size, {value: globalBytes}),
      ]),
    ]),
    needBytes > 1 ? h('a.right', {onClick: handleMissingFiles}, 'Missing Files') : h('span.right'),
  ])
}

const LastScan = ({lastScan, handleScan}) =>
h('div.section-item.last-scan', [
  h('p.left', 'Last Scan:'),
  h(FromNow, {className: 'center', value: lastScan}),
  h('a.right', {onClick: handleScan}, 'Force Scan'),
])
