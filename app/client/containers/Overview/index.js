import React, { Component, PropTypes } from 'react'
import h from 'react-hyperscript'
import { connect } from 'react-redux'

import moment from 'moment'
import { clipboard } from 'electron'

class Overview extends Component {
  render(){
    const { status } = this.props
    console.log(moment.duration(status.uptime, "minutes").hours())
    return h('div.padded-more', [
      h('header.page-header', [
        h('h2', 'Overview Page'),
      ]),
      h('hr'),
      h(DeviceID, status),
      h(CpuUsage, status),
    ])
  }
}

Overview.propTypes = {
  myID: PropTypes.string.isRequired,
}

export default connect(
  state => ({
    status: state.systemStatus,
  })
)(Overview)

const CpuUsage = ({cpuPercent}) => h('div.section-item.cpu-usage', [
  h('p.left', 'CPU Usage:'),
  h('p.center', `${Math.round(cpuPercent * 10) / 10} %`),
  h('a.right'),
])

const DeviceID = ({myID}) => h('div.section-item.my-id', [
  h('p.left', 'My ID:'),
  h('p.center', myID),
  h('a.right', {onClick: () => clipboard.writeText(myID)}, 'Copy'),
])
