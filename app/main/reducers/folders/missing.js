export default function missing(state = {}, {type, payload, id}) {
  switch (type) {
    case 'MISSING_GET_SUCCESS':

    //Ignore if page is not the same (e.g after page change)
    if(state[id] && (payload.page != state[id].page)){
      return state
    }

    const progress = payload.progress.map(file => ({
      ...file,
      status: 'progress',
    }))
    const queued = payload.queued.map(file => ({
      ...file,
      status: 'queued',
    }))
    const rest = payload.rest.map(file => ({
      ...file,
      status: 'rest',
    }))
    return {
      ...state,
      [id]: {
        page: (state[id] && state[id].page) || 1,
        perpage: payload.perpage,
        total: payload.total,
        missing: [
          ...progress,
          ...queued,
          ...rest,
        ],
      },
    }
    case 'MISSING_PAGE_SET':
    return {
      ...state,
      [id]: {
        ...state[id],
        page: payload,
        missing: [],
      },
    }
    default:
    return state
  }
}
