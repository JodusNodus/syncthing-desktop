export default function guiPreferences(state = {}, {type, payload}) {
  switch (type) {
    case 'GUI_PREFERENCES_GET_SUCCESS':
      return payload;
    default:
      return state 
  }
}
