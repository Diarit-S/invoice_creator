<template lang="pug">
  div.selector-container
    //-- Selector
    template
      b-button.is-info(
        icon-left="plus-circle-outline" 
        @click="goToEmptyDoc"
        size="is-large"
      ) Créer un nouveau document

      b-dropdown(
          aria-role="list"
        )
          template(#trigger)
            b-button.button.is-info(size="is-large") Modifier un document existant
          b-dropdown-item(
            @click="goToDocumentSelector('quote')"
          ) Modifier un Devis
          b-dropdown-item(
            @click="goToDocumentSelector('invoice')"
          ) Modifier une Facture

</template>

<script>
export default {
  name: 'EditOrCreatePaper',
  data() {
    return {
      isEdition: false
    }
  },
  methods: {
    goToEmptyDoc() {
      this.$router.push('/')
    },
    goToDocumentSelector(type) {
      this.$router.push(`/selectDocument/${type}`)
    }
  }

}
</script>

<style lang="scss" scoped>

.selector-container {
  height: 100vh;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-evenly;
}

</style>