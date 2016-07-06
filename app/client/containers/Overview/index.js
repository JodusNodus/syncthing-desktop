import React, { Component, PropTypes } from 'react'
import h from 'react-hyperscript'
import { connect } from 'react-redux'

import moment from 'moment'
import { clipboard } from 'electron'

import { styles } from './styles.scss'

class Overview extends Component {
  render(){
    const { status } = this.props

    return h('div.padded-more', {className: styles}, [
      h('header.page-header', [
        h('h2', 'Overview'),
      ]),
      h('hr'),
      h(DeviceID, status),
      h(CpuUsage, status),
    ])
  }
}

Overview.propTypes = {
  status: PropTypes.object.isRequired,
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
  h('div.right', [
    h('a', {onClick: () => clipboard.writeText(myID)}, 'Copy'),
    h('a', {onClick: () => clipboard.writeText(myID)}, 'QR Code'),   
  ])
])
