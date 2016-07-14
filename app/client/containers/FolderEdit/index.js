import { PropTypes, Component } from 'react'
import h from 'react-hyperscript'
import { reduxForm } from 'redux-form'
import Input from '../../components/Input'
import { CheckBox } from 'react-photonkit'
import * as messageBarActionCreators from '../../actions/message-bar'
import { bindActionCreators } from 'redux'
import _ from 'lodash'

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
    errors.label = 'Label should use atleast one character'
  }

  //Rescan Interval
  if(isNaN(parseInt(rescanIntervalS))){
    errors.rescanIntervalS = 'Rescan Interval must be a number'
  }else if(parseInt(rescanIntervalS) < 1){
    errors.rescanIntervalS = 'Rescan Interval must be higher than 0'
  }

  return errors
}

class FolderEdit extends Component {
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
