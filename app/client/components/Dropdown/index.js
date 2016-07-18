import { PropTypes, Component, cloneElement } from 'react'
import h from 'react-hyperscript'
import { Link } from 'react-router'

import { styles } from './styles.scss'

export default class Dropdown extends Component {
  constructor(props){
    super(props)
    this.state = {
      show: false,
    }

    this.hide = this.hide.bind(this)
    this.toggle = this.toggle.bind(this)
  }
  hide(){
    this.setState({
      show: false,
    })
  }
  toggle(){
    this.setState({
      show: !this.state.show,
    })
  }
  render(){
    const { children, options } = this.props

    const list = options.map(({text, link}) => {
      return h(Link, {to: link, onClick: this.hide}, text)
    })

    return h('div', {className: styles}, [
      cloneElement(children, {onClick: this.toggle}),
      this.state.show && h('div.dropdown', list),
    ])
  }
}

Dropdown.propTypes = {
  children: PropTypes.element.isRequired,
  options: PropTypes.array.isRequired,
}
