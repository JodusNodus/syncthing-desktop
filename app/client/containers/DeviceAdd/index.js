import { PropTypes, Component } from 'react'
import h from 'react-hyperscript'
import { connect } from 'react-redux'

import Modal from 'client/components/Modal'
import QrReader from 'react-qr-reader'
import DeviceEdit from 'client/containers/DeviceEdit'
import Header from 'client/components/Header'

import { hideQrCodeScanModal, scanQrCode } from 'client/actions/qr-code-scan-modal'

const initialValues = {
  deviceID: '',
  name: '',
  addresses: ['dynamic'],
  compression: 'metadata',
  introducer: false,
}

@connect(
  state => ({
    qrCodeScanModal: state.qrCodeScanModal,
  }),
  {hideQrCodeScanModal, scanQrCode},
  undefined,
  {withRef: true},
)
export default class DeviceAdd extends Component {
  static propTypes = {
    onSubmit: PropTypes.func.isRequired,
    qrCodeScanModal: PropTypes.object.isRequired,
    hideQrCodeScanModal: PropTypes.func.isRequired,
    scanQrCode: PropTypes.func.isRequired,
  }

  render(){
    const {
      onSubmit,
      qrCodeScanModal,
      hideQrCodeScanModal,
      scanQrCode,
    } = this.props

    return h('div.padded-more', [
      //Modal for scanning qr codes
      h(Modal, {
        doneButton: false,
        onCancel: hideQrCodeScanModal,
        visible: qrCodeScanModal.show,
      }, [
        qrCodeScanModal.show && h(QrReader, {
          handleScan: myID => {
            scanQrCode(myID)
            hideQrCodeScanModal()
          },
          handleError: console.error,
          previewStyle: {
            width: '100%',
          },
        }),
      ]),

      h(Header, [
        h('h2', 'Add Device'),
      ]),
      h('hr'),
      h(DeviceEdit, {ref: 'form', initialValues, onSubmit}),
    ])
  }
}
