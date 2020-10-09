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
          span {{ quote.documentNumber }}
          span {{ quote.clientId }}
          span {{ quote.creationDate }}
      footer.modal-card-foot
        b-button.is-info.button(type="button" @click="$emit('createClient')") Valider
</template>

<script>
export default {
  name: 'QuoteSelectionModal',
  data() {
    return {
      quotes: []
    }
  },
  methods: {
    async getAllQuotePapers() {
      const res = await this.$http.get(`/paper/getPapersOfType/quote`)
      this.quotes = res.data
    },
    chooseQuote(quote) {
      this.$emit('selectQuote', quote)
    }
  },
  created() {
    this.getAllQuotePapers()
  }
}
</script>

<style lang="scss" scoped>
.quote {
  cursor: pointer;
  &:hover {
    box-shadow: 0 0 20px;
  }
}
</style>