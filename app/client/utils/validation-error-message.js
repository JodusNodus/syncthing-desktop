import _ from 'lodash'

export default function validationErrorMessage({ fields, showMessageBar, hideMessageBar }) {

  //Check for errors in fields
  const errors = _.toArray(fields).filter(({error}) => error)

  if(errors.length > 0){
    const firstError = errors[0].error
    const hasBeenTouched = errors[0].touched

    //Show error in message bar if it has been touched
    if(hasBeenTouched){
      showMessageBar({
        msg: firstError,
        ptStyle: 'negative',
      })
    }

  }else{

    //No errors have to be shown hide the bar.
    hideMessageBar()
  }
}
