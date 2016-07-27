export default function folderMissing(state = {}, {type, payload, id}) {
  switch (type) {
    case 'MISSING_GET_SUCCESS':
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
        page: payload.page,
        perpage: payload.perpage,
        total: payload.total,
        missing: [
          ...progress,
          ...queued,
          ...rest,
        ],
      },
    }
    default:
    return state
  }
}
