export default function validate({ hostname='', port='', apiKey='' }) {
  const errors = {}

  //Hostname
  if(hostname.length < 1){
    errors.hostname = 'Hostname should have at least one character.'
  }

  //Port
  if(isNaN(parseInt(port))){
    errors.port = 'Port should be a number.'
  }else if(parseInt(port) < 1){
    errors.port = 'Port should be larger than 1.'
  }else if(parseInt(port) > 65535){ //Port number is an unsigned 16-bit integer > 65535
    errors.port = 'Port should be smaller than 65535.'
  }

  //ApiKey
  if(apiKey.length < 1){
    errors.apiKey = 'ApiKey should have at least one character.'
  }

  return errors
}
