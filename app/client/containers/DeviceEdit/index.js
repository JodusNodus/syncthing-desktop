import { PropTypes, Component } from 'react'
import h from 'react-hyperscript'
import { reduxForm } from 'redux-form'
import Input from '../../components/Input'
import { CheckBox } from 'react-photonkit'
import * as messageBarActionCreators from '../../actions/message-bar'
import { bindActionCreators } from 'redux'
import _ from 'lodash'

const fields = [
  'name',
  'addresses',
  'compression',
  'introducer',
]

function validate({
  name='',
  addresses=[],
}) {
  const errors = {}

  //Name
  if(name.length < 1){
    errors.name = 'Name is too short'
  }

  //Addresses
  if(addresses.length < 1){
    errors.addresses = 'Atleast one address is required'
  }

  return errors
}

class DeviceEdit extends Component {
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
        name,
        addresses,
        compression,
        introducer,
      },
    } = this.props

    const compressionOptions = [
      {value: 'always', text: 'All Data'},
      {value: 'metadata', text: 'Only Metadata'},
      {value: 'never', text: 'No Data'},
    ]

    return h('form', [
      h(Input, {label: 'Name', ...name}),
      h(Input, {label: 'Addresses', ...addresses}),
      h(CheckBox, {label: 'Introducer', ...introducer}),
      h('div.form-group', [
        h('label', 'Compression'),
        h('select.form-control', {...compression}, compressionOptions.map(
          ({value, text}) => h('option', {value}, text)
        )),
      ]),
    ])
  }
}

DeviceEdit.propTypes = {
  fields: PropTypes.object.isRequired,
  initialValues: PropTypes.object.isRequired,
  showMessageBar: PropTypes.func.isRequired,
  hideMessageBar: PropTypes.func.isRequired,
}

export default reduxForm(
  {
    form: 'deviceEdit',
    fields,
    validate,
  },
  () => {},
  dispatch => bindActionCreators(messageBarActionCreators, dispatch)
)(DeviceEdit)
