import { Component, PropTypes } from 'react'
import h from 'react-hyperscript'
import { reduxForm } from 'redux-form'

import { CheckBox } from 'react-photonkit'
import Input from 'client/components/Input'

import { showMessageBar, hideMessageBar } from 'client/actions/message-bar'
import validationErrorMessage from 'client/utils/validation-error-message'
import validate from './validate'

import { styles } from './styles.scss'

const fields = [
  'host',
  'port',
  'apiKey',
  'https',
  'autoLaunch',
]

class ClientPreferences extends Component {
  static propTypes = {
    fields: PropTypes.object.isRequired,
    showMessageBar: PropTypes.func.isRequired,
    hideMessageBar: PropTypes.func.isRequired,
  }

  componentDidUpdate(){
    validationErrorMessage(this.props)
  }
  render(){
    const {
      fields: {
        host,
        port,
        apiKey,
        https,
        autoLaunch,
      },
    } = this.props

    return h('form.padded-more', {className: styles}, [
      h(Input, {label: 'Host', placeholder: 'e.g. localhost', ...host}),
      h(Input, {label: 'Port', placeholder: 'e.g. 8384', ...port}),
      h(Input, {label: 'API Key', placeholder: 'e.g. abc123', ...apiKey}),
      h(CheckBox, {label: 'Https', ...https}),
      h(CheckBox, {label: 'Launch at Startup', ...autoLaunch}),
    ])
  }
}

export default reduxForm(
  {
    form: 'clientPreferences',
    fields,
    validate,
  },
  state => ({ // mapStateToProps
    initialValues: state.config.config,
  }),
  {showMessageBar, hideMessageBar},
)(ClientPreferences)
