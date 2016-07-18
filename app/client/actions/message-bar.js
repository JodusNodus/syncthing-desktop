export const showMessageBar = payload => ({
  type: 'MESSAGE_BAR_SHOW',
  payload,
})

export const hideMessageBar = () => ({
  type: 'MESSAGE_BAR_HIDE',
})
