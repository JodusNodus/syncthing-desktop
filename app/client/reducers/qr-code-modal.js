const initialState = {
  show: false,
  qrCode: "",
}

export default function qrCodeModal(state=initialState, {type, payload}) {
  switch (type) {
    case 'QR_CODE_MODAL_SHOW':
      return {
      show: true,
      qrCode: payload,
    }
    case 'QR_CODE_MODAL_HIDE':
      return initialState
    default:
      return state
  }
}
