import { PropTypes, Component, cloneElement } from 'react'
import h from 'react-hyperscript'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import Toggle from '../../components/Toggle'
import SegmentedControl from '../../components/SegmentedControl'
import { styles } from './styles.scss'

import * as systemActionCreators from '../../../main/actions/system'

class Device extends Component {
  handleToggle(){
    const { resumeDevice, pauseDevice } = this.props
    if(this.device.paused){
      resumeDevice(this.device.deviceID)
    }else{
      pauseDevice(this.device.deviceID)
    }
  }
  render(){
    const { devices, params, children, onSubmit } = this.props
    this.device = devices.filter(x => x.deviceID == params.id)[0]

    if(this.device) {
      return h('div.padded-more', {className: styles}, [ 
        h('header.page-header', [
          h('h2', this.device.name),
          h(Toggle, {state: !this.device.paused, onToggle: this.handleToggle.bind(this)}),
        ]),
        h(SegmentedControl, {buttons: [
          {text: 'Overview', link: `/device/${params.id}/overview`},
          {text: 'Edit', link: `/device/${params.id}/edit`},
        ]}, [
          cloneElement(children, {ref: 'form', initialValues: this.device, onSubmit}),
        ]),
      ])
    }else {
      return h('div', [
        h('h1', 'Device not available'),
      ])
    }
  }
}

Device.propTypes = {
  params: PropTypes.object.isRequired,
  devices: PropTypes.array.isRequired,
  resumeDevice: PropTypes.func.isRequired,
  pauseDevice: PropTypes.func.isRequired,
  children: PropTypes.element.isRequired,
}

export default connect(
  state => ({
    devices: state.devices,
  }),
  dispatch => bindActionCreators(systemActionCreators, dispatch),
  undefined,
  {withRef: true},
)(Device)
