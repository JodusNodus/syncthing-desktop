export const showQrCodeScanModal = () => ({
  type: 'QR_CODE_SCAN_MODAL_SHOW',
})

export const hideQrCodeScanModal = () => ({
  type: 'QR_CODE_SCAN_MODAL_HIDE',
})

export const scanQrCode = qrCode => ({
  type: 'QR_CODE_SCAN',
  payload: qrCode,
})
