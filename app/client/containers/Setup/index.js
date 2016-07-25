import { PropTypes, Component } from 'react'
import h from 'react-hyperscript'
import { connect } from 'react-redux'

import { Button } from 'react-photonkit'
import ClientPreferences from 'client/containers/ClientPreferences'

import { getAutomaticSetup, useManualSetup } from 'client/actions/automatic-setup'
import { setClientConfig } from 'main/actions/config'

import { styles } from './styles.scss'

@connect(
  state => ({automaticSetup: state.automaticSetup}),
  {getAutomaticSetup, setClientConfig, useManualSetup},
)
export default class Setup extends Component {
  static propTypes = {
    getAutomaticSetup: PropTypes.func.isRequired,
    useManualSetup: PropTypes.func.isRequired,
    automaticSetup: PropTypes.object.isRequired,
    setClientConfig: PropTypes.func.isRequired,
  }
  componentDidMount(){
    this.props.getAutomaticSetup()
  }
  handleSubmit(form){
    this.props.setClientConfig(form)
  }
  handleSaveButton(){
    this.refs.manual.submit()
  }
  handleUseLocal(){
    const { automaticSetup, setClientConfig } = this.props
    const config = automaticSetup.config
    const [ host, port ] = config.address.split(':')
    setClientConfig({
      host,
      port,
      apiKey: config.apikey,
      https: config.tls,
    })
  }
  handleManual(){
    this.props.useManualSetup()
  }
  render(){
    const { automaticSetup } = this.props

    return h('div', {className: styles}, [
      automaticSetup.isFetching && h('span.fa.fa-spinner.fa-pulse.fa-fw.fa-4x'),
      automaticSetup.isSuccess && h('div.local-instance-success', [
        h('p.title', 'Local Syncthing instance found.'),
        h('p.subtitle', `at ${automaticSetup.config.address}`),
        h(Button, {
          ptStyle: 'primary',
          onClick: this.handleUseLocal.bind(this),
          text: 'Use local',
        }),
        h(Button, {
          ptStyle: 'default',
          onClick: this.handleManual.bind(this),
          text: 'Manual Setup',
        }),
      ]),
      (automaticSetup.isFailure || automaticSetup.useManual) && h('div.local-instance-failure', [
        automaticSetup.isFailure && h('div.titles', [
          h('p.title', 'No Syncthing instance was found.'),
          h('p.subtitle', 'Please enter manualy'),
        ]),
        h(ClientPreferences, {ref: 'manual', onSubmit: this.handleSubmit.bind(this)}),
        h(Button, {
          ptStyle: 'primary',
          onClick: this.handleSaveButton.bind(this),
          text: 'Save',
        }),
      ]),
    ])
  }
}
