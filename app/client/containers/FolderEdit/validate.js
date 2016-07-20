export default function validate({
  id='',
  label='',
  path='',
  rescanIntervalS='',
  minDiskFreePct='',
}) {
  const errors = {}
  //Path
  if(path.length < 1){
    errors.path = 'Path should be a valid directory.'
  }

  //Folder ID
  if(id.length < 1){
    errors.id = 'Folder ID should have at least one character.'
  }

  //Label
  if(label.length < 1) {
    errors.label = 'Label should have at least one character.'
  }

  //Rescan Interval
  if(isNaN(parseInt(rescanIntervalS))){
    errors.rescanIntervalS = 'Rescan Interval should be a number.'
  }else if(parseInt(rescanIntervalS) < 1){
    errors.rescanIntervalS = 'Rescan Interval should be larger than 0.'
  }

  //Minimum Disk Free
  if(isNaN(parseInt(minDiskFreePct))){
    errors.minDiskFreePct = 'Minimum Disk Free should be a number.'
  }else if(parseInt(minDiskFreePct) > 100 || parseInt(minDiskFreePct) < 0){
    errors.minDiskFreePct = 'Minimum Disk Free should be percent value between 0 and 100.'
  }

  return errors
}
