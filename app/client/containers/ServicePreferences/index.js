import { Component, PropTypes } from 'react'
import h from 'react-hyperscript'
import { reduxForm } from 'redux-form'
import {
  Input,
  CheckBox,
} from 'react-photonkit'

class ServicePreferences extends Component {
  render(){
    const {
      fields: {
        deviceName,
        globalAnnounceEnabled,
        localAnnounceEnabled,
        relaysEnabled,
        globalAnnounceServers,
        listenAddresses,
        maxRecvKbps,
        maxSendKbps,
        natEnabled,
      },
    } = this.props

    return h('form.padded-more', [
      h(Input, {label: 'Device Name', ...deviceName}),
      h(Input, {label: 'Sync Protocol Listen Addresses', ...listenAddresses}),
      h(Input, {label: 'Incoming Rate Limit (KiB/s)', type: 'number', ...maxRecvKbps}),
      h(Input, {label: 'Outgoing Rate Limit (KiB/s)', type: 'number', ...maxSendKbps}),

      h(CheckBox, {label: 'Enable NAT traversal', ...natEnabled}),
      h(CheckBox, {label: 'Global Discovery', ...globalAnnounceEnabled}),
      h(CheckBox, {label: 'Local Discovery', ...localAnnounceEnabled}),
      h(CheckBox, {label: 'Enable Relaying', ...relaysEnabled}),

      h(Input, {label: 'Global Discovery Servers', ...globalAnnounceServers}),
    ])
  }
}

ServicePreferences.propTypes = {
  fields: PropTypes.object.isRequired,
}

export default reduxForm({
  form: 'preferences',
  fields: [
    'deviceName',
    'globalAnnounceEnabled',
    'localAnnounceEnabled',
    'relaysEnabled',
    'globalAnnounceServers',
    'listenAddresses',
    'maxRecvKbps',
    'maxSendKbps',
    'natEnabled',
  ],
}, state => ({ // mapStateToProps
  initialValues: state.preferences,
}))(ServicePreferences)
