export const showMissingModal = () => ({
  type: 'MISSING_MODAL_SHOW',
})

export const hideMissingModal = () => ({
  type: 'MISSING_MODAL_HIDE',
})

export const setMissingPage = (id, payload) => ({
  type: 'MISSING_PAGE_SET',
  id,
  payload, //Page
})
