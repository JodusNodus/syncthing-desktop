import path from 'path'
import fs from 'fs'
import XML from 'pixl-xml'
import { remote } from 'electron'
const { app } = remote

export const getAutomaticSetup = () => dispatch => {
  const failure = error => dispatch({
    type: 'AUTOMATIC_SETUP_FAILURE',
    error,
  })

  const configPath = path.join(
    app.getPath('appData'),
    process.platform == 'linux' ? 'syncthing' : 'Syncthing',
    'config.xml',
  )

  fs.readFile(configPath, (err, data) => {
    if(!err){
      try {
        const config = XML.parse(data).gui

        dispatch({
          type: 'AUTOMATIC_SETUP_SUCCESS',
          payload: config,
        })

      } catch (err) {
        failure(err)
      }
    }else{
      failure(err)
    }
  })
}

export const useManualSetup = () => ({
  type: 'MANUAL_SETUP_USE',
})
