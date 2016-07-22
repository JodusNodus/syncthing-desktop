import { Component, PropTypes } from 'react'
import h from 'react-hyperscript'
import moment from 'moment'

const capitalizeFirstLetter = str => [
  str.charAt(0).toUpperCase(),
  str.slice(1),
].join('')

export default class FromNow extends Component {
  static propTypes = {
    value: PropTypes.string.isRequired,
  }
  componentDidMount(){
    //Force redraw every 5 seconds
    this.interval = setInterval(() => {
      this.setState({ ping: 'pong' })
    }, 5000)
  }
  componentWillUnmount(){
    clearInterval(this.interval)
  }
  render(){
    const { value, ...args } = this.props
    const text = moment(value).fromNow()
    const isNotValid = moment('0001').isSame(value) || moment(0).isSame(value)

    return h('span', args, isNotValid ? 'Never' : capitalizeFirstLetter(text))
  }
}
