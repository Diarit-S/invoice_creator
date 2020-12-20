<template lang="pug">
  div
    p Redirection
</template>

<script>
export default {
  methods: {
    redirect() {
      window.open(`mailto:${this.$route.params.email}`, '_blank')
    }
  },
  mounted() {
    this.redirect();
  }
}
</script>