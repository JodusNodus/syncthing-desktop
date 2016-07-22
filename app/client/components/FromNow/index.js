import { Component, PropTypes } from 'react'
import h from 'react-hyperscript'
import moment from 'moment'

import { styles } from './styles.scss'

export default class FromNow extends Component {
  static propTypes = {
    value: PropTypes.string.isRequired,
    className: PropTypes.string,
  }
  componentDidMount(){
    //Force redraw every 5 seconds
    this.interval = this.setInterval(() => {
      this.setState({ ping: 'pong' })
    }, 5000)
  }
  componentWillUnmount(){
    clearInterval(this.interval)
  }
  render(){
    const { value, className='', ...args } = this.props
    return h('span', {className: `${styles} ${className}`, ...args}, moment('0001').isSame(value) ? 'Never' : moment(value).fromNow())
  }
}
