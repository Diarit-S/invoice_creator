<template lang="pug">
  div.selector-container
    b-button.is-info(
      icon-left="plus-circle-outline" 
      @click="goToEmptyDoc"
      size="is-large"
    ) Créer un nouveau document
    b-button.is-info(
      icon-left="pencil" 
      @click="goToDocSelection"
      size="is-large"
    ) Modifier un document existant
</template>

<script>
export default {
  name: 'EditOrCreatePaper',
  methods: {
    goToEmptyDoc() {
      this.$router.push('/')
    },
    goToDocSelection() {
      console.log('goToDocSelection')
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