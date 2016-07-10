export default function power(state = 'awake', {type}) {
  switch (type){
  case 'SUSPEND':
    return 'suspended'
  case 'RESUME':
    return 'awake'
  default:
    return state
  }
}
