<template lang="pug">
  form(action="" style="width: 800px")
    .modal-card(style="width: auto")
      header.modal-card-head
        p.modal-card-title Selectionner un devis
        button.delete(
          type="button"
          @click="$emit('close')"
        )
      section.modal-card-body
        div.quote(v-for="quote in quotes" :key="quote._id" @click="chooseQuote(quote)")
          span n° {{ quote.documentNumber }}
          span {{ clientNameFromClientId(quote.clientId) }}
          span {{ creationDate(quote.creationDate) }}
      footer.modal-card-foot
        b-button.is-info.button(type="button" @click="$emit('createClient')") Valider
</template>

<script>
import moment from 'moment'

export default {
  name: 'QuoteSelectionModal',
  data() {
    return {
      quotes: []
    }
  },
  props: {
    clients: {
      type: Array,
      required: true
    }
  },
  methods: {
    async getAllQuotePapers() {
      const res = await this.$http.get(`/paper/getPapersOfType/quote`)
      this.quotes = res.data
    },
    chooseQuote(quote) {
      this.$emit('selectQuote', quote)
    },
    clientNameFromClientId(clientId) {
      return this.clients.find(client => client._id === clientId).fullName
    },
    creationDate(date) {
      return moment(date).format('LL')
    },
  },
  created() {
    this.getAllQuotePapers()
  }
}
</script>

<style lang="scss" scoped>
.quote {
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  padding: 5px;
  border-radius: 4px;
  transition: all 0.15s ease-in-out;

  span {
    width: 33%;
  }
  &:hover {
    box-shadow: 3px 3px 5px 1px rgba($color: gray, $alpha: 0.2);
    transform: translateY(-5px)
  }
}
</style>