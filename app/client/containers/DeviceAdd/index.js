import { PropTypes, Component } from 'react'
import h from 'react-hyperscript'
import { reduxForm } from 'redux-form'
import Input from '../../components/Input'
import { CheckBox } from 'react-photonkit'
import * as messageBarActionCreators from '../../actions/message-bar'
import * as qrCodeScanModalActionCreators from '../../actions/qr-code-scan-modal'
import { bindActionCreators } from 'redux'
import validationErrorMessage from '../../utils/validation-error-message'

const fields = [
  'deviceID',
  'name',
  'addresses',
  'compression',
  'introducer',
]

const initialValues = {
  name: '',
  addresses: ['dynamic'],
  compression: 'metadata',
  introducer: false,
}

function validate({
  deviceID='',
  name='',
  addresses=[],
}) {
  const errors = {}

  //Device ID
  if(deviceID.length < 1){
    errors.deviceID = 'Device ID should have at least one character.'
  }

  //Name
  if(name.length < 1){
    errors.name = 'Name should have at least one character.'
  }

  //Addresses
  if(addresses.length < 1){
    errors.addresses = 'Addresses should have at least one address.'
  }

  return errors
}

class DeviceAdd extends Component {
  componentWillUpdate(newProps){
    validationErrorMessage(this.props)

    if(!this.props.qrCodeScanModal.qrCode && newProps.qrCodeScanModal.qrCode){
      this.props.fields.deviceID.onChange(newProps.qrCodeScanModal.qrCode)
    }
  }
  handleQrCodeClick(){
    const { showQrCodeScanModal } = this.props
    showQrCodeScanModal()
  }
  render(){
    const {
      fields: {
        deviceID,
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

    return h('form.padded-more', [
      h(Input, {label: 'Device ID', placeholder: 'e.g. P56IOI7-MZJNU2Y-IQGDREY-DM2MGTI-MGL3BXN-PQ6W5BM-TBBZ4TJ-XZWICQ2', ...deviceID}),
      h('a', {onClick: this.handleQrCodeClick.bind(this) }, 'QR Code'),   
      h(Input, {label: 'Name', placeholder: 'e.g. Phone', ...name}),
      h(Input, {label: 'Addresses', placeholder: 'e.g. tcp://192.168.1.18:22000', ...addresses, initialValue: []}),
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

DeviceAdd.propTypes = {
  fields: PropTypes.object.isRequired,
  showMessageBar: PropTypes.func.isRequired,
  hideMessageBar: PropTypes.func.isRequired,
  showQrCodeScanModal: PropTypes.func.isRequired,
  qrCodeScanModal: PropTypes.object.isRequired,
}

export default reduxForm(
  {
    form: 'deviceAdd',
    fields,
    validate,
    initialValues,
  },
  state => ({qrCodeScanModal: state.qrCodeScanModal}),
  dispatch => bindActionCreators({
    ...messageBarActionCreators,
    ...qrCodeScanModalActionCreators,
  }, dispatch)
)(DeviceAdd)
