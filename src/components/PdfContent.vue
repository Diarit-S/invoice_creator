<template>
  <div class="pdf-content">
    <p>{{ content.title }}</p>
  </div>
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
