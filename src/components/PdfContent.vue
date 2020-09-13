<template lang="pug">
  div.pdf-content
    p {{ content.type }}
</template>

<script>
export default {
  name: 'PdfContent',
  props: {
    content: {
      type: Object,
      required: true
    }
  }
}
</script>

<style scoped>

</style>
