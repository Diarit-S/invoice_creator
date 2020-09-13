import axios from "axios"

let setup = {
  initSetup() {
    this.setBaseUrl()
    this.setDefaultHeader()
  },
  setBaseUrl() {
    axios.defaults.baseURL = 'https://frozen-everglades-18700.herokuapp.com/api/'
  },
  setDefaultHeader() {
    // axios.defaults.headers.common["Accept"] = "application/json"
  }
}

export default setup