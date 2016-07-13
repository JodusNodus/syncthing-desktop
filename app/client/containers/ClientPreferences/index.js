import { Component, PropTypes } from 'react'
import h from 'react-hyperscript'
import { reduxForm } from 'redux-form'
import { CheckBox } from 'react-photonkit'
import Input from '../../components/Input'
import { styles } from './styles.scss'
import * as messageBarActionCreators from '../../actions/message-bar'
import { bindActionCreators } from 'redux'
import _ from 'lodash'

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
