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

class FolderOverview extends Component {
  componentDidMount(){
    this.getDeviceCompletion.apply(this)
  }
  componentWillUpdate(newProps){
    const { initialValues: { id } } = this.props
    const isNewFolder = id !== newProps.initialValues.id

    if(isNewFolder){
      this.getDeviceCompletion.apply(this)
    }
  }
  getDeviceCompletion(){
    const { initialValues, getDeviceFolderCompletion } = this.props

    const sharedDevices = initialValues.devices.filter(x => x)

    getDeviceFolderCompletion(sharedDevices, initialValues.id)
  }
  render(){
    const { devices, initialValues, status } = this.props
    const folder = initialValues

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
  params: PropTypes.object.isRequired,
  status: PropTypes.object.isRequired,
  devices: PropTypes.array.isRequired,
  initialValues: PropTypes.object.isRequired,
  getDeviceFolderCompletion: PropTypes.func.isRequired,
}

export default connect(
  state => ({
    status: state.systemStatus,
    devices: state.devices,
  }),
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
