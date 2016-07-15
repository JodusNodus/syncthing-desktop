const initialState = {
  show: false,
  qrCode: undefined, //needs to be string for qr-code component to not throw error
}

export default function qrCodeScanModal(state=initialState, {type, payload}) {
  switch (type) {
    case 'QR_CODE_SCAN_MODAL_SHOW':
      return {
      qrCode: undefined,
      show: true,
    }
    case 'QR_CODE_SCAN_MODAL_HIDE':
      return {
      ...state,
      show: false,
    }
    case 'QR_CODE_SCAN':
      return {
      ...state,
      qrCode: payload,
    }
    default:
      return state
  }
}
