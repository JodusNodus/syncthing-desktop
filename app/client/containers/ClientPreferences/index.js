import { Component, PropTypes } from 'react'
import h from 'react-hyperscript'
import { reduxForm } from 'redux-form'
import { CheckBox } from 'react-photonkit'
import Input from '../../components/Input'
import { styles } from './styles.scss'


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
    errors.hostname = 'Too short'
  }

  //Port
  if(isNaN(parseInt(port))){
    errors.port = 'Must be a number'
  }else if(parseInt(port) < 1){
    errors.port = 'Too small'
  }else if(parseInt(port) > 65535){ //Port number is an unsigned 16-bit integer > 65535
    errors.port = 'Too large'
  }

  //ApiKey
  if(apiKey.length < 1){
    errors.apiKey = 'ApiKey is too short'
  }

  return errors
}

class ClientPreferences extends Component {
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

      //h('div.form-group', [
      //h('label', 'Password'),
      //h('input.form-control', {label: 'Password', type: 'password', ...password}),
      //]),
    ])
  }
}

ClientPreferences.propTypes = {
  fields: PropTypes.object.isRequired,
}

export default reduxForm(
  {
    form: 'clientPreferences',
    fields,
    validate,
  },
  state => ({ // mapStateToProps
    initialValues: state.config.config,
  })
)(ClientPreferences)
