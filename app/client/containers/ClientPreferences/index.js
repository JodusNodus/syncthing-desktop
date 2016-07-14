import { Component, PropTypes } from 'react'
import h from 'react-hyperscript'
import { reduxForm } from 'redux-form'
import { CheckBox } from 'react-photonkit'
import Input from '../../components/Input'
import { styles } from './styles.scss'
import * as messageBarActionCreators from '../../actions/message-bar'
import { bindActionCreators } from 'redux'
import validationErrorMessage from '../../utils/validation-error-message'

const fields = [
  'hostname',
  'port',
  'apiKey',
  'https',
]

function validate({ hostname='', port='', apiKey='' }) {
  const errors = {}

  //Hostname
  if(hostname.length < 1){
    errors.hostname = 'Hostname should have at least one character.'
  }

  //Port
  if(isNaN(parseInt(port))){
    errors.port = 'Port should be a number.'
  }else if(parseInt(port) < 1){
    errors.port = 'Port should be larger than 1.'
  }else if(parseInt(port) > 65535){ //Port number is an unsigned 16-bit integer > 65535
    errors.port = 'Port should be smaller than 65535.'
  }

  //ApiKey
  if(apiKey.length < 1){
    errors.apiKey = 'ApiKey should have at least one character.'
  }

  return errors
}

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
