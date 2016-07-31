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

//ADD selector with correct bytes to human readable conversion
export const getBandwithRates = ({bandwithRates}) => {
  const {
    upBytes,
    downBytes,
    newUpBytes,
    newDownBytes,
  } = bandwithRates

  return {
    upBytes: formatBytes(newUpBytes - upBytes),
    downBytes: formatBytes(newDownBytes - downBytes),
  }
}
