import React , { Component, PropTypes } from 'react'
import h from 'react-hyperscript'
import ChartJS from 'chart.js'

export default class Chart extends Component {
  componentDidMount(){
    const { type, data, options } = this.props
    const ctx = this.refs.ctx

    this.chart = new ChartJS(ctx, {
      type,
      data,
      options,
    })
  }
  componentDidUpdate(){
    this.chart.render()
  }
  render(){
    const { height, width } = this.props
    return h('canvas', {ref: 'ctx', height, width})
  }
}

Chart.propTypes = {
  height: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  type: PropTypes.string.isRequired,
  data: PropTypes.object.isRequired,
  options: PropTypes.object,
}
