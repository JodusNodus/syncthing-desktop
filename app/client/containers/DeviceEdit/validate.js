const deviceIDFormat = /([A-Z0-9]{7}\-?){8}/

export default function validate({
  deviceID='',
  name='',
  addresses=[],
}) {
  const errors = {}

  //Device ID
  if(deviceID.length < 1){
    errors.deviceID = 'Device ID should have at least one character.'
  }else if(!deviceIDFormat.test(deviceID)){
    //Test if deviceID is correctly formatted
    errors.deviceID = 'Device ID should conform to the official format.'
  }


  //Name
  if(name.length < 1){
    errors.name = 'Name should have at least one character.'
  }

  //Addresses
  if(addresses.length < 1){
    errors.addresses = 'Addresses should have at least one address.'
  }

  return errors
}
