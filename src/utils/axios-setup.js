import axios from "axios"

let setup = {
  initSetup() {
    this.setBaseUrl()
    this.setDefaultHeader()
  },
  setBaseUrl() {
    axios.defaults.baseURL = process.env.VUE_APP_API_URL
  },
  setDefaultHeader() {
    // axios.defaults.headers.common["Accept"] = "application/json"
  }
}

export default setup