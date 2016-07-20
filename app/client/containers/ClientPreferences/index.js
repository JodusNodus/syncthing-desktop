import { Component, PropTypes } from 'react'
import h from 'react-hyperscript'
import { reduxForm } from 'redux-form'
import { bindActionCreators } from 'redux'

import { CheckBox } from 'react-photonkit'
import Input from 'client/components/Input'

import * as messageBarActionCreators from 'client/actions/message-bar'
import validationErrorMessage from 'client/utils/validation-error-message'
import validate from './validate'

import { styles } from './styles.scss'

const fields = [
  'hostname',
  'port',
  'apiKey',
  'https',
]

class ClientPreferences extends Component {
  componentDidUpdate(){
    validationErrorMessage(this.props)
  }
  render(){
    const {
      fields: {
        hostname,
        port,
        apiKey,
        https,
      },
    } = this.props

    return h('form.padded-more', {className: styles}, [
      h(Input, {label: 'Hostname', placeholder: 'e.g. localhost', ...hostname}),
      h(Input, {label: 'Port', placeholder: 'e.g. 8384', ...port}),
      h(Input, {label: 'API Key', placeholder: 'e.g. abc123', ...apiKey}),
      h(CheckBox, {label: 'Https', ...https}),
    ])
  }
}

ClientPreferences.propTypes = {
  fields: PropTypes.object.isRequired,
  showMessageBar: PropTypes.func.isRequired,
  hideMessageBar: PropTypes.func.isRequired,
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
  dispatch => bindActionCreators(messageBarActionCreators, dispatch)
)(ClientPreferences)
