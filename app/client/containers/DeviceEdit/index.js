import { PropTypes, Component } from 'react'
import h from 'react-hyperscript'
import { reduxForm } from 'redux-form'
import Input from '../../components/Input'
import { CheckBox } from 'react-photonkit'
import * as messageBarActionCreators from '../../actions/message-bar'
import { bindActionCreators } from 'redux'
import validationErrorMessage from '../../utils/validation-error-message'

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
    validationErrorMessage(this.props)
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
