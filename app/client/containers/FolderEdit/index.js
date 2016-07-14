import { PropTypes, Component } from 'react'
import h from 'react-hyperscript'
import { reduxForm } from 'redux-form'
import Input from '../../components/Input'
import { CheckBox } from 'react-photonkit'

import { styles } from './styles.scss'

const fields = [
  'label',
  'rescanIntervalS',
  'ignorePerms',
  'order',
]

function validate({
  label,
  rescanIntervalS,
  ignorePerms,
  order,
}) {
  const errors = {}
  return errors
}

class FolderEdit extends Component {
  render(){
    const {
      fields: {
        label,
        rescanIntervalS,
        ignorePerms,
        order,
      },
    } = this.props

    const orderOptions = [
      {value: 'random', text: 'Random'},
      {value: 'alphabetic', text: 'Alphabetic'},
      {value: 'smallestFirst', text: 'Smallest First'},
      {value: 'largestFirst', text: 'Largest First'},
      {value: 'oldestFirst', text: 'Oldest First'},
    ]

    return h('form', {className: styles}, [
      h(Input, {label: 'Label', ...label}),
      h(Input, {label: 'Rescan Interval (s)', type: 'number', ...rescanIntervalS}),
      h(CheckBox, {label: 'Ignore Permissions', ...ignorePerms}),
      h('div.form-group', [
        h('label', 'Order'),
        h('select.form-control', {...order}, orderOptions.map(
          ({value, text}) => h('option', {value}, text)
        )),
      ])
    ])
  }
}

FolderEdit.propTypes = {
  fields: PropTypes.array.isRequired,
  initialValues: PropTypes.object.isRequired,
}

export default reduxForm(
  {
    form: 'folderEdit',
    fields,
    validate,
  },
)(FolderEdit)
