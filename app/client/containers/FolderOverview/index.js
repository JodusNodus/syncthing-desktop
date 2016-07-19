import { PropTypes, Component } from 'react'
import h from 'react-hyperscript'
import { connect } from 'react-redux'
import { shell } from 'electron'
import { bindActionCreators } from 'redux'

import Size from '../../components/Size'
import SharedDevices from '../../components/SharedDevices'
import { styles } from './styles.scss'
import Progress from 'react-progressbar'

import * as dbActionCreators from '../../../main/actions/db'
import { getDevices } from '../../../main/reducers/devices'
import { getFolder } from '../../../main/reducers/folders'

class FolderOverview extends Component {
  componentDidMount(){
    this.getDeviceCompletion.apply(this)
  }
  componentWillUpdate(newProps){
    const { folder } = this.props
    const isNewFolder = folder.id !== newProps.folder.id

    if(isNewFolder){
      this.getDeviceCompletion.apply(this)
    }
  }
  getDeviceCompletion(){
    const { folder, getDeviceFolderCompletion } = this.props

    const sharedDevices = folder.devices

    getDeviceFolderCompletion(sharedDevices, folder.id)
  }
  render(){
    const { folder, devices, status } = this.props
    console.log(folder.status)

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
      folder.status && h(InSync, folder.status),
      h(SharedDevices, {devices: sharedDevices}),
    ])
  }
}

FolderOverview.propTypes = {
  status: PropTypes.object.isRequired,
  devices: PropTypes.array.isRequired,
  folder: PropTypes.object.isRequired,
  getDeviceFolderCompletion: PropTypes.func.isRequired,
}

const mapStateToProps = (state, {params}) => ({
  status: state.systemStatus,
  devices: getDevices(state),
  folder: getFolder(state, params.id),
})

export default connect(
  mapStateToProps,
  dispatch => bindActionCreators(dbActionCreators, dispatch),
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
