export function showQrCodeScanModal() {
  return {
    type: 'QR_CODE_SCAN_MODAL_SHOW',
  }
}

export function hideQrCodeScanModal() {
  return {
    type: 'QR_CODE_SCAN_MODAL_HIDE',
  }
}

export function scanQrCode(qrCode){
  return {
    type: 'QR_CODE_SCAN',
    payload: qrCode,
  }
}
