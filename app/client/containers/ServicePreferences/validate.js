export default function validate({
  globalAnnounceServers=[],
  listenAddresses=[],
  maxRecvKbps='',
  maxSendKbps='',
}) {
  const errors = {}

  //Global Discovery Servers
  if(globalAnnounceServers.length < 1){
    errors.globalAnnounceServers = 'Global Discovery Servers should have at least one server.'
  }

  //Listen Addresses
  if(listenAddresses.length < 1){
    errors.listenAddresses = 'Listen Addresses should have at least one address.'
  }

  //Incoming Rate Limit
  if(isNaN(parseInt(maxRecvKbps))){
    errors.maxRecvKbps = 'Incoming Rate Limit should be a number.'
  }

  //Outgoing Rate Limit
  if(isNaN(parseInt(maxSendKbps))){
    errors.maxSendKbps = 'Outgoing Rate Limit should be a number.'
  }

  return errors
}
