const initialState = {
  show: false,
  qrCode: '', //needs to be string for qr-code component to not throw error
}

export default function qrCodeModal(state=initialState, {type, payload}) {
  switch (type) {
    case 'QR_CODE_MODAL_SHOW':
      return {
      show: true,
      qrCode: payload,
    }
    case 'QR_CODE_MODAL_HIDE':
      /*
       * notice that qrCode stays the same,
       * this is beacuse the hiding is animated and removing the qr code
       * would result in a sudden change or disappearance of the qr code
       * while the animation is still going.
       */
      return {
      ...state,
      show: false,
    }
    default:
      return state
  }
}
