import { Component, PropTypes } from 'react'
import h from 'react-hyperscript'
import { reduxForm } from 'redux-form'
import { Input, CheckBox } from 'react-photonkit'

import { styles } from './styles.scss'

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

    return h('div.padded-more', {className: styles}, [
      h('header.page-header', [
        h('h2', 'Client'),
      ]),
      h('hr'),
      h('form', [
        h(Input, {label: 'Hostname', placeholder: 'e.g. localhost', ...hostname}),
        h(Input, {label: 'Port', placeholder: 'e.g. 8384', ...port}),
        h(Input, {label: 'API Key', placeholder: 'e.g. abc123', ...apiKey}),
        h(CheckBox, {label: 'Https', ...https}),

        //h('div.form-group', [
        //h('label', 'Password'),
        //h('input.form-control', {label: 'Password', type: 'password', ...password}),
        //]),
      ]),
    ])
  }
}

ClientPreferences.propTypes = {
  fields: PropTypes.object.isRequired,
}

export default reduxForm(
  {
    form: 'setup',
    fields: [
      'hostname',
      'port',
      'apiKey',
      'https',
    ],
  },
  state => ({ // mapStateToProps
    initialValues: state.config.config
  })
)(ClientPreferences)
