import { Component, PropTypes } from 'react'
import h from 'react-hyperscript'
import { connect } from 'react-redux'
import moment from 'moment'
import { clipboard } from 'electron'

import Modal from 'client/components/Modal'
import QRCode from 'qrcode.react'
import Size from 'client/components/Size'
import Header from 'client/components/Header'

import { getConnections } from 'main/actions/system'
import { showQrCodeModal, hideQrCodeModal } from 'client/actions/qr-code-modal'
import { showMessageBar } from 'client/actions/message-bar'

import { getBandwithRates } from 'client/reducers/bandwith-rates'

import { styles } from './styles.scss'

@connect(
  state => ({
    status: state.systemStatus,
    version: state.version,
    bandwithRates: getBandwithRates(state),
    qrCodeModal: state.qrCodeModal,
  }),
  {
    showQrCodeModal,
    hideQrCodeModal,
    showMessageBar,
    getConnections,
  },
)
export default class Overview extends Component {
  static propTypes = {
    status: PropTypes.object.isRequired,
    version: PropTypes.object.isRequired,
    qrCodeModal: PropTypes.object.isRequired,
    bandwithRates: PropTypes.object.isRequired,
    showQrCodeModal: PropTypes.func.isRequired,
    showMessageBar: PropTypes.func.isRequired,
    hideQrCodeModal: PropTypes.func.isRequired,
    //For bandwithRates
    getConnections: PropTypes.func.isRequired,
  }

  componentDidMount(){
    const { getConnections } = this.props

    //Bandwith Rate per second
    this.interval = setInterval(getConnections, 1000)
  }
  componentWillUnmount(){
    if(this.interval) clearInterval(this.interval)
  }
  handleCopy(myID){
    clipboard.writeText(myID)
    this.props.showMessageBar({
      msg: 'Device ID was copied to the clipboard.',
      ptStyle: 'positive',
    })
  }
  render(){
    const {
      status,
      version,
      showQrCodeModal,
      qrCodeModal,
      hideQrCodeModal,
      bandwithRates,
    } = this.props

    return h('div.padded-more', {className: styles}, [

      //Modal for displaying qr codes
      h(Modal, {
        cancelButton: false,
        onDone: hideQrCodeModal,
        visible: qrCodeModal.show,
      }, [
        h(QRCode, {size: 250, value: qrCodeModal.qrCode}),
      ]),

      h(Header, [
        h('h2', 'Overview'),
      ]),
      h('hr'),
      h(DeviceID, {onQrCode: showQrCodeModal, onCopy: this.handleCopy.bind(this) , ...status}),
      status && h(CpuUsage, status),
      status && h(RamUsage, status),
      h(UploadRate, bandwithRates),
      h(DownloadRate, bandwithRates),
      status && h(Uptime, status),
      version && h(Version, version),
    ])
  }
}

const CpuUsage = ({cpuPercent}) => h('div.section-item.cpu-usage', [
  h('p.left', 'CPU Usage:'),
  h('p.center', `${Math.round(cpuPercent * 10) / 10} %`),
  h('a.right'),
])

const RamUsage = ({sys}) => h('div.section-item.ram-usage', [
  h('p.left', 'RAM Usage:'),
  h('p.center', [
    h(Size, {value: sys}),
  ]),
  h('a.right'),
])

const DeviceID = ({myID, onQrCode, onCopy}) => h('div.section-item.my-id', [
  h('p.left', 'My ID:'),
  h('p.center', myID),
  h('div.right', [
    h('a', {onClick: () => onCopy(myID)}, 'Copy'),
    h('a', {onClick: () => onQrCode(myID)}, 'QR Code'),
  ]),
])

const UploadRate = ({upBytes}) => h('div.section-item.upload-rate', [
  h('p.left', 'Upload Rate:'),
  h('p.center', upBytes),
  h('a.right'),
])

const DownloadRate = ({downBytes}) => h('div.section-item.download-rate', [
  h('p.left', 'Download Rate:'),
  h('p.center', downBytes),
  h('a.right'),
])

const durationDisplay = x => {
  const units = [
    'seconds',
    'minutes',
    'hours',
    'days',
    'months',
    'years',
  ]

  const parsedUnits = units.map(unit => {
    const amount = x.get(unit)
    if(amount >= 1){
      return amount + ' ' + (amount == 0 ? unit.slice(0, unit.length - 1) : unit)
    }else{
      return false
    }
  }).filter(x => x).reverse()

  const shownUnits = parsedUnits.slice(0, 2)
  return shownUnits.join(', ')
}

const Uptime = ({uptime}) => h('div.section-item.uptime', [
  h('p.left', 'Uptime:'),
  h('p.center', durationDisplay(moment.duration(uptime, 'seconds'))),
  h('p.right'),
])

const Version = ({version}) => h('div.section-item.version', [
  h('p.left', 'Version:'),
  h('p.center', `Syncthing ${version}`),
  h('a.right'),
])
