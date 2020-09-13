import axios from "axios"

let setup = {
  initSetup() {
    this.setBaseUrl()
    this.setDefaultHeader()
  },
  setBaseUrl() {
    axios.defaults.baseURL = 'http://localhost:3000/api/'
    // 'http://localhost:3000/api/'
    // 'https://frozen-everglades-18700.herokuapp.com/api/'
  },
  setDefaultHeader() {
    // axios.defaults.headers.common["Accept"] = "application/json"
  }
}

export default setup