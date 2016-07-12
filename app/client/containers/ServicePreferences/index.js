import { Component, PropTypes } from 'react'
import h from 'react-hyperscript'
import { reduxForm } from 'redux-form'
import { CheckBox } from 'react-photonkit'
import Input from '../../components/Input'
import * as messageBarActionCreators from '../../actions/message-bar'
import { bindActionCreators } from 'redux'
import _ from 'lodash'

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
    errors.deviceName = 'Too short'
  }

  //Global Discovery Servers
  if(globalAnnounceServers.length < 1){
    errors.globalAnnounceServers = 'Too short'
  }

  //Listen Addresses
  if(listenAddresses.length < 1){
    errors.listenAddresses = 'Too short'
  }

  //Incoming Rate Limit
  if(isNaN(parseInt(maxRecvKbps))){
    errors.maxRecvKbps = 'Must be a number'
  }

  //Outgoing Rate Limit
  if(isNaN(parseInt(maxSendKbps))){
    errors.maxSendKbps = 'Must be a number'
  }
  
  return errors
}

class ServicePreferences extends Component {
  componentDidUpdate(){
    const { fields, showMessageBar, hideMessageBar } = this.props
    
    //Check for errors in fields
    const errors = _.toArray(fields).filter(({error}) => error)

    if(errors.length > 0){
      const firstError = errors[0].error
      const hasBeenTouched = errors[0].touched

      //Show error in message bar if it has been touched
      if(hasBeenTouched){
        showMessageBar({
          msg: firstError,
          ptStyle: 'negative',
        })
      }

    }else{

      //No errors have to be shown hide the bar.
      hideMessageBar()
    }
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
