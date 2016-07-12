import { PropTypes } from 'react'
import h from 'react-hyperscript'

import { styles } from './styles.scss'

const Input = ({ value, label, className='', touched, error, ...args}) =>
h('div.form-group', {className: `${styles} ${touched && error && 'error'} ${className}`}, [
  label && h('label', label),
  h('input.form-control', {value, ...args}),
])

Input.propTypes = {
  label: PropTypes.string,
  className: PropTypes.string,
  touched: PropTypes.bool,
  error: PropTypes.string,
  value: PropTypes.string.isRequired,
}

export default Input
