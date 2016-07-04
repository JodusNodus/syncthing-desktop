import React, { PropTypes, Component } from 'react'
import h from 'react-hyperscript'
import { connect } from 'react-redux'

class Device extends Component {
  render(){
    const { devices, params } = this.props
    const device = devices.filter(x => x.deviceID == params.id)[0]

    return device ? h('div', [ 
      h('h1', device.name),
    ]) : h('div', [
      h('h1', 'Device not available'),
    ])
  }
}

Device.propTypes = {
  params: PropTypes.object.isRequired,
  devices: PropTypes.array.isRequired,
}

export default connect(
  state => ({
    devices: state.devices,
  })
)(Device)
