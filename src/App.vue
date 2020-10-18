<template>
  <div id="app">
    <router-view
      :content="content"
      :amountsData="amountsData"
    ></router-view>
  </div>
</template>

<script>
// import CreatorForm from './components/CreatorForm'

// import { jsPDF } from 'jspdf'
// import 'jspdf-autotable'

export default {
  name: 'App',
  data() {
    return {
      content: {
        currentPaper: {
          type: 'quote',
          fields: [
            {unit: 'm²'}
          ],
          TVAPercent: 10,
          documentNumber: 0,
          clientId: '',
          creationDate: new Date()
        },
        clients: [],
        previousLinkedPapers: []
      },
    }
  },
  computed: {
    currentClient() {
      return this.content.clients.find(client => {
        return client._id === this.content.content.paper.clientId
      }) || {}
    },
    tableFields() {
      return this.content.currentPaper.fields
    },
    advancedPaymentsHtSum() {
      return this.content.previousLinkedPapers.reduce((sum, currentInvoice) => {
        sum += parseFloat(currentInvoice.fields.reduce((acc, currentField) => {
          if (currentField.amount) {
            acc += currentField.amount
          }
          return acc
        }, 0).toFixed(2))
        return sum
      }, 0)
    },
    totalWithoutTaxes() {
      const fieldsSum = parseFloat(this.content.currentPaper.fields.reduce((acc, currentField) => {
        if (currentField.amount) {
          acc += currentField.amount
        }
        return acc
      }, 0).toFixed(2))
      if (this.content.previousLinkedPapers && this.content.previousLinkedPapers.length) {
        return fieldsSum - this.advancedPaymentsHtSum
      }
      return fieldsSum
    },
    taxeAmount() {
      return parseFloat((this.totalWithoutTaxes * (this.content.currentPaper.TVAPercent / 100)).toFixed(2))
    },
    totalAmount() {
      return parseFloat((this.totalWithoutTaxes + this.taxeAmount).toFixed(2))
    },
    amountsData() {
      return {
        totalWithoutTaxes: this.totalWithoutTaxes,
        taxeAmount: this.taxeAmount,
        totalAmount: this.totalAmount
      }
    }
  },
  methods: {
    async getClients() {
      const clients = await this.$http.get('/client/')
      this.content.clients = clients.data
    }
  },
  created() {
    this.getClients()
  }
}
</script>

<style lang="scss" scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
