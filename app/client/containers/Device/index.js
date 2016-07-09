import React, { PropTypes, Component } from 'react'
import h from 'react-hyperscript'
import { connect } from 'react-redux'
import { clipboard } from 'electron'
import moment from 'moment'
import { bindActionCreators } from "redux"

import Toggle from '../../components/Toggle'
import SharedFolders from '../../components/SharedFolders'
import { styles } from './styles.scss'

import * as deviceActionCreators from '../../actions/device'

class Device extends Component {
  handleToggle(){
    const { resume, pause } = this.props
    if(this.device.paused){
      resume(this.device.deviceID)
    }else{
      pause(this.device.deviceID)
    }
  }
  render(){
    const { devices, params, folders } = this.props
    this.device = devices.filter(x => x.deviceID == params.id)[0]

    const sharedFolders = folders.filter(folder => {
      return 0 < folder.devices.filter(x => x.deviceID == this.device.deviceID).length
    })

    return this.device ? h('div.padded-more', {className: styles}, [ 
      h('header.page-header', [
        h('h2', this.device.name),
        h(Toggle, {state: !this.device.paused, onToggle: this.handleToggle.bind(this)}),
      ]),
      h('hr'),
      h(DeviceID, this.device),
      h(Status, this.device),
      !this.device.online && this.device.lastSeen && h(LastSeen, this.device),
      h(SharedFolders, {folders: sharedFolders}),
    ]) : h('div', [
      h('h1', 'Device not available'),
    ])
  }
}

Device.propTypes = {
  params: PropTypes.object.isRequired,
  devices: PropTypes.array.isRequired,
  folders: PropTypes.array.isRequired,
  resume: PropTypes.func.isRequired,
  pause: PropTypes.func.isRequired,
}

export default connect(
  state => ({
    devices: state.devices,
    folders: state.folders,
  }),
  dispatch => bindActionCreators(deviceActionCreators, dispatch)
)(Device)

const DeviceID = ({deviceID}) => h('div.section-item.device-id', [
  h('p.left', 'Device ID:'),
  h('p.center', [
    deviceID,
  ]),
  h('a.right', {onClick: () => clipboard.writeText(deviceID)}, 'Copy'),
])

const Status = ({online, address}) => h('div.section-item', [
  h('p.left', 'Status:'),
  h('p.center', [
    h('span.icon.icon-record', {className: online ? 'online': 'offline'}),
    online ? `Connected at ${address}` : 'Not connected',
  ]),
  h('div.right'),
])

const LastSeen = ({lastSeen}) => h('div.section-item.last-seen', [
  h('p.left', 'Last Seen:'),
  h('p.center', moment(lastSeen).fromNow()),
  h('div.right'),
])
