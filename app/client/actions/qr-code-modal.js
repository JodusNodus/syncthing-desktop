export const showQrCodeModal = qrCode => ({
  type: 'QR_CODE_MODAL_SHOW',
  payload: qrCode,
})

export const hideQrCodeModal = () => ({
  type: 'QR_CODE_MODAL_HIDE',
})
