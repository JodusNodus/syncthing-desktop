import { PropTypes } from 'react'
import h from 'react-hyperscript'
import _ from 'lodash'

import { styles } from './styles.scss'

const handleChange = (initialValue, onChange) => e => {
  const value = e.target.value

  if(_.isArray(initialValue)){
    const valueArray = value
    .split(',')
    .map(str => str.trim())

    onChange(valueArray)
  }else{
    onChange(value)
  }
}

const Input = ({ value, onChange, label, className='', touched, error, initialValue, ...args}) =>
h('div.form-group', {className: `${styles} ${touched && error && 'error'} ${className}`}, [
  label && h('label', label),
  h('input.form-control', {value, onChange: handleChange(initialValue, onChange), ...args}),
])

Input.propTypes = {
  label: PropTypes.string,
  className: PropTypes.string,
  touched: PropTypes.bool,
  error: PropTypes.string,
  value: PropTypes.any.isRequired,
  initialValue: PropTypes.any.isRequired,
}

export default Input
