import React, { PropTypes, Component } from 'react'
import h from 'react-hyperscript'
import { connect } from 'react-redux'
import { Table, Button, ButtonGroup } from 'react-photonkit'

import { styles } from './styles.scss'

class Device extends Component {
  render(){
    const { devices, params, folders } = this.props
    const device = devices.filter(x => x.deviceID == params.id)[0]

    const sharedFolders = folders.filter(folder => {
      return 0 < folder.devices.filter(x => x.deviceID == device.deviceID).length
    })

    return device ? h('div.padded-more', {className: styles}, [ 
      h('header.page-header', [
        h('h1', device.name),
      ]),
      h('hr'),
      h(DeviceID, device),
      h(Status, device),
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
}

export default connect(
  state => ({
    devices: state.devices,
    folders: state.folders,
  })
)(Device)

const DeviceID = ({deviceID}) => h('div.section-item.device-id', [
  h('p.left', 'Device ID:'),
  h('p.center', deviceID),
  h('div.right'),
])

const Status = ({online, address}) => h('div.section-item', [
  h('p.left', 'Status:'),
  h('p.center', [
    h('span.icon.icon-record', {className: online ? 'online': 'offline'}),
    online ? `Connected at ${address}` : 'Not connected',
  ]),
  h('div.right'),
])

const SharedFolders = ({folders}) => h('div.section-item.shared-folders', [
  h('p.left', 'Shared Folders:'),
  h('div.center', [
    h(Table, [
      h('thead', [
        h('tr', [
          h('th', 'Name'),
          h('th', 'Size'),
        ]),
      ]),
      h('tbody', folders.map(({id, status}) => h('tr', [
        h('td', id),
        h('td', status.globalBytes),
      ]))),
    ]),
    h(ButtonGroup, [
      h(Button, {ptStyle: 'default', glyph: 'plus'}),
      h(Button, {ptStyle: 'default', glyph: 'minus'}),    
    ]),
  ]),
  h('div.right'),
])
