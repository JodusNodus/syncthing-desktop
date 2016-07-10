import fs from 'fs'
import path from 'path'
import os from 'os'

const home = os.homedir()
const dir = path.join(home, '/.config/syncthing-tray.json')
const template = {
  hostname: 'localhost',
  port: 8384,
  apiKey: null, 
}

function readConfig(cb){
  fs.readFile(dir, (err, data) => cb(JSON.parse(data)))
}

function update(config, cb){
  fs.writeFile(dir, JSON.stringify(config), () => cb ? cb() : null)
}

export default function config(cb){
  let state = null
  const methods = {
    dir(){
      return dir
    },
    get(){
      return state
    },
    put(x, y){
      state[x] = y
      update(state)
    },
  }
  fs.stat(dir, (err, stats) => {
    if(!err && stats.isFile()){
      readConfig(config => {
        state = config
        cb(methods)
      })
    }else{
      fs.writeFile(dir, JSON.stringify(template), () => readConfig(config => {
        state = config
        cb(methods)
      }))
    }
  })

}
