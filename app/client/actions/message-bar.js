export function showMessageBar(payload) {
  return {
    type: 'MESSAGE_BAR_SHOW',
    payload,
  }
}

export function hideMessageBar() {
  return {
    type: 'MESSAGE_BAR_HIDE',
  }
}
