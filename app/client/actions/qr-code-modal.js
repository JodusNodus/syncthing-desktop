export function showQrCodeModal(qrCode) {
  return {
    type: 'QR_CODE_MODAL_SHOW',
    payload: qrCode,
  }
}

export function hideQrCodeModal() {
  return {
    type: 'QR_CODE_MODAL_HIDE',
  }
}
