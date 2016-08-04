import { Component, PropTypes } from 'react'
import h from 'react-hyperscript'
import { reduxForm } from 'redux-form'

import { CheckBox } from 'react-photonkit'
import Input from 'client/components/Input'

import * as messageBarActionCreators from 'client/actions/message-bar'
import { bindActionCreators } from 'redux'
import validationErrorMessage from 'client/utils/validation-error-message'
import randomString from 'client/utils/random-string'

import validate from './validate.js'

import { getInitialValues } from './selectors'

const fields = [
  'globalAnnounceEnabled',
  'localAnnounceEnabled',
  'relaysEnabled',
  'globalAnnounceServers',
  'listenAddresses',
  'maxRecvKbps',
  'maxSendKbps',
  'natEnabled',
  'guiAddress',
  'guiUser',
  'guiPassword',
  'guiUseTLS',
  'guiApiKey',
]

class ServicePreferences extends Component {
  static propTypes = {
    fields: PropTypes.object.isRequired,
    showMessageBar: PropTypes.func.isRequired,
    hideMessageBar: PropTypes.func.isRequired,
  }

  componentDidUpdate(){
    validationErrorMessage(this.props)
  }
  handleGenerateApiKey(){
    randomString(32).then(str => {
      this.props.fields.guiApiKey.onChange(str.random)
    })
  }
  render(){
    const {
      fields: {
        globalAnnounceEnabled,
        localAnnounceEnabled,
        relaysEnabled,
        globalAnnounceServers,
        listenAddresses,
        maxRecvKbps,
        maxSendKbps,
        natEnabled,
        guiAddress,
        guiUser,
        guiPassword,
        guiUseTLS,
        guiApiKey,
      },
    } = this.props

    return h('form.padded-more', [
      h(Input, {label: 'Sync Protocol Listen Addresses', ...listenAddresses}),
      h(Input, {label: 'Incoming Rate Limit (KiB/s)', type: 'number', ...maxRecvKbps}),
      h(Input, {label: 'Outgoing Rate Limit (KiB/s)', type: 'number', ...maxSendKbps}),
      h(CheckBox, {label: 'Enable NAT traversal', ...natEnabled}),
      h(CheckBox, {label: 'Global Discovery', ...globalAnnounceEnabled}),
      h(CheckBox, {label: 'Local Discovery', ...localAnnounceEnabled}),
      h(CheckBox, {label: 'Enable Relaying', ...relaysEnabled}),
      h(Input, {label: 'Global Discovery Servers', ...globalAnnounceServers}),

      h(Input, {label: 'GUI Listen Addresses', ...guiAddress}),
      h(Input, {label: 'GUI Authentication User', ...guiUser}),
      h(Input, {label: 'GUI Authentication Password', type: 'password', ...guiPassword}),
      h(CheckBox, {label: 'Use HTTPS for GUI', ...guiUseTLS}),
      h(Input, {label: [
        'API Key',
        h('a', {onClick: this.handleGenerateApiKey.bind(this)}, 'Generate New API Key'),
      ], ...guiApiKey}),
    ])
  }
}

export default reduxForm(
  {
    form: 'servicePreferences',
    fields,
    validate,
  },
  state => ({ // mapStateToProps
    initialValues: getInitialValues(state),
  }),
  dispatch => bindActionCreators(messageBarActionCreators, dispatch)
)(ServicePreferences)
