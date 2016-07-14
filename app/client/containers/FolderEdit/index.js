import { PropTypes, Component } from 'react'
import h from 'react-hyperscript'
import { reduxForm } from 'redux-form'
import Input from '../../components/Input'
import { CheckBox } from 'react-photonkit'
import * as messageBarActionCreators from '../../actions/message-bar'
import { bindActionCreators } from 'redux'
import validationErrorMessage from '../../utils/validation-error-message'

import { styles } from './styles.scss'

const fields = [
  'label',
  'rescanIntervalS',
  'ignorePerms',
  'order',
]

function validate({
  label='',
  rescanIntervalS='',
}) {
  const errors = {}

  //Label
  if(label.length < 1) {
    errors.label = 'Label should have at least one character.'
  }

  //Rescan Interval
  if(isNaN(parseInt(rescanIntervalS))){
    errors.rescanIntervalS = 'Rescan Interval should be a number.'
  }else if(parseInt(rescanIntervalS) < 1){
    errors.rescanIntervalS = 'Rescan Interval should be larger than 0.'
  }

  return errors
}

class FolderEdit extends Component {
  componentDidUpdate(){
    validationErrorMessage(this.props)
  }
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
      ]),
    ])
  }
}

FolderEdit.propTypes = {
  fields: PropTypes.object.isRequired,
  initialValues: PropTypes.object.isRequired,
  showMessageBar: PropTypes.func.isRequired,
  hideMessageBar: PropTypes.func.isRequired,
}

export default reduxForm(
  {
    form: 'folderEdit',
    fields,
    validate,
  },
  () => {},
  dispatch => bindActionCreators(messageBarActionCreators, dispatch)
)(FolderEdit)
