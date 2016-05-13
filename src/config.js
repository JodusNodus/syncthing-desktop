import fs from "fs"
import path from "path"
import os from "os"

const home = os.homedir()
const dir = path.join(home, "/.config/syncthing-tray.json")
const template = {
  hostname: "localhost",
  port: 8384,
  apiKey: ""
}

function readConfig(cb){
  fs.readFile(dir, (err, data) => cb(JSON.parse(data)))
}

function update(config, cb){
  fs.writeFile(dir, JSON.stringify(config), () => cb ? cb() : null)
}

export default class Config {
  constructor() {
    this.state = { ...template }
    fs.stat(dir, (err, stats) => {
      if(!err && stats.isFile()){
        readConfig(config => this.state = config)
      }else{
        fs.writeFile(dir, JSON.stringify(template), () => readConfig(config => this.state = config))
      }
    })
  }
  get(){
    return this.state
  }
  put(x, y){
    this.state[x] = y
    update(this.state)
  }
}
