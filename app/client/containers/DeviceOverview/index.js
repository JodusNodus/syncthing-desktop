import { PropTypes, Component } from 'react'
import h from 'react-hyperscript'
import { connect } from 'react-redux'
import { clipboard } from 'electron'
import moment from 'moment'
import { bindActionCreators } from 'redux'

import * as messageBarActionCreators from '../../actions/message-bar'
import SharedFolders from '../../components/SharedFolders'
import { getFolders } from '../../../main/reducers/folders'
import { getDevice } from '../../../main/reducers/devices'

class DeviceOverview extends Component {
  handleCopy(myID){
    clipboard.writeText(myID)
    this.props.showMessageBar({
      msg: 'Device ID was copied to the clipboard.',
      ptStyle: 'positive',
    })
  }
  render(){
    const { folders, device } = this.props

    const sharedFolders = folders.filter(folder => {
      return 0 < folder.devices.filter(x => x.deviceID == device.deviceID).length
    })

    return h('div', [
      h(DeviceID, {onCopy: this.handleCopy.bind(this), ...device}),
      h(Status, device),
      !device.connected && device.lastSeen && h(LastSeen, device),
      h(SharedFolders, {folders: sharedFolders}),
    ])
  }
}

DeviceOverview.propTypes = {
  folders: PropTypes.array.isRequired,
  device: PropTypes.object.isRequired,
  showMessageBar: PropTypes.func.isRequired,
}

const mapStateToProps = (state, {params}) => ({
  folders: getFolders(state),
  device: getDevice(state, params.id),
})

export default connect(
  mapStateToProps,
  dispatch => bindActionCreators(messageBarActionCreators, dispatch),
)(DeviceOverview)

const DeviceID = ({deviceID, onCopy}) => h('div.section-item.device-id', [
  h('p.left', 'Device ID:'),
  h('p.center', [
    deviceID,
  ]),
  h('a.right', {onClick: () => onCopy(deviceID)}, 'Copy'),
])

const Status = ({connected, address}) => h('div.section-item', [
  h('p.left', 'Status:'),
  h('p.center', [
    h('span.icon.icon-record', {className: connected ? 'online': 'offline'}),
    connected ? `Connected at ${address}` : 'Not connected',
  ]),
  h('div.right'),
])

const LastSeen = ({lastSeen}) => h('div.section-item.last-seen', [
  h('p.left', 'Last Seen:'),
  h('p.center', moment(lastSeen).fromNow()),
  h('div.right'),
])
