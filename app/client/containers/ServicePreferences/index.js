import { Component, PropTypes } from 'react'
import h from 'react-hyperscript'
import { reduxForm } from 'redux-form'
import { CheckBox } from 'react-photonkit'
import Input from '../../components/Input'
import * as messageBarActionCreators from '../../actions/message-bar'
import { bindActionCreators } from 'redux'
import _ from 'lodash'
import validationErrorMessage from '../../utils/validation-error-message'

const fields = [
  'deviceName',
  'globalAnnounceEnabled',
  'localAnnounceEnabled',
  'relaysEnabled',
  'globalAnnounceServers',
  'listenAddresses',
  'maxRecvKbps',
  'maxSendKbps',
  'natEnabled',
]

function validate({
  deviceName='',
  globalAnnounceServers=[],
  listenAddresses=[],
  maxRecvKbps='',
  maxSendKbps='',
}) {
  const errors = {}

  //Device Name
  if(deviceName.length < 1){
    errors.deviceName = 'Device Name should have at least one character.'
  }

  //Global Discovery Servers
  if(globalAnnounceServers.length < 1){
    errors.globalAnnounceServers = 'Global Discovery Servers should have at least one server.'
  }

  //Listen Addresses
  if(listenAddresses.length < 1){
    errors.listenAddresses = 'Listen Addresses should have at least one address.'
  }

  //Incoming Rate Limit
  if(isNaN(parseInt(maxRecvKbps))){
    errors.maxRecvKbps = 'Incoming Rate Limit should be a number.'
  }

  //Outgoing Rate Limit
  if(isNaN(parseInt(maxSendKbps))){
    errors.maxSendKbps = 'Outgoing Rate Limit should be a number.'
  }
  
  return errors
}

class ServicePreferences extends Component {
  componentDidUpdate(){
    validationErrorMessage(this.props)
  }
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
  showMessageBar: PropTypes.func.isRequired,
  hideMessageBar: PropTypes.func.isRequired,
}

export default reduxForm(
  {
    form: 'servicePreferences',
    fields,
    validate,
  },
  state => ({ // mapStateToProps
    initialValues: state.preferences,
  }),
  dispatch => bindActionCreators(messageBarActionCreators, dispatch)
)(ServicePreferences)
