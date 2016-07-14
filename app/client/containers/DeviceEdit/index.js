import { PropTypes, Component } from 'react'
import h from 'react-hyperscript'
import { reduxForm } from 'redux-form'
import Input from '../../components/Input'
import { CheckBox } from 'react-photonkit'

const fields = [
  'name',
  'addresses',
  'compression',
  'introducer',
]

function validate({
  name,
  addresses,
  compression,
  introducer,
}) {
  const errors = {}
  return errors
}

class DeviceEdit extends Component {
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
  fields: PropTypes.array.isRequired,
  initialValues: PropTypes.object.isRequired,
}

export default reduxForm(
  {
    form: 'deviceEdit',
    fields,
    validate,
  },
)(DeviceEdit)
