export default function guiPreferences(state = {}, {type, payload}) {
  switch (type) {
    case 'PREFERENCES_GUI_SUCCESS':
      return payload;
    default:
      return state 
  }
}
