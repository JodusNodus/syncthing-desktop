import { createSelectorCreator, defaultMemoize } from 'reselect'
import { isEqual } from 'lodash'

// create a "selector creator" that uses deep checking
const createDeepEqualSelector = createSelectorCreator(
  defaultMemoize,
  isEqual
)

import { formatBytes } from 'main/utils/misc'

const initialState = {
  upBytes: 0,
  downBytes: 0,
  newUpBytes: 0,
  newDownBytes: 0,
}

export default function bandwithRates(state = initialState, {type, payload}) {
  switch (type) {
    case 'BANDWITH_TOTAL_GET_SUCCESS':
    return {
      upBytes: state.newUpBytes,
      downBytes: state.newDownBytes,
      newUpBytes: payload.upBytes,
      newDownBytes: payload.downBytes,
    }
    default:
    return state
  }
}

export const getBandwithRates = createDeepEqualSelector(
  [state => state.bandwithRates],
  ({
    upBytes,
    downBytes,
    newUpBytes,
    newDownBytes,
  }) => ({
    upBytes: formatBytes(newUpBytes - upBytes),
    downBytes: formatBytes(newDownBytes - downBytes),
  })
)
